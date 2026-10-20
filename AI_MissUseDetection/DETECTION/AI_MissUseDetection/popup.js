document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleProtection');
    const statusIndicator = document.getElementById('statusIndicator');
    const viewLogsBtn = document.getElementById('viewLogs');
    const logsDiv = document.getElementById('logs');
    const totalScansEl = document.getElementById('totalScans');
    const blockedCountEl = document.getElementById('blockedCount');

    // Load current status
    chrome.storage.local.get(['protectionEnabled', 'stats'], function(data) {
        const isEnabled = data.protectionEnabled !== false; // Default to true
        updateStatus(isEnabled);
        updateStats(data.stats || { total: 0, blocked: 0 });
    });

    // Toggle protection
    toggleBtn.addEventListener('click', function() {
        chrome.storage.local.get(['protectionEnabled'], function(data) {
            const newStatus = !(data.protectionEnabled !== false);
            chrome.storage.local.set({ protectionEnabled: newStatus });
            updateStatus(newStatus);
            
            // Notify content script
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleProtection',
                        enabled: newStatus
                    });
                }
            });
        });
    });

    // View logs
    viewLogsBtn.addEventListener('click', function() {
        chrome.storage.local.get(['history'], function(data) {
            const history = data.history || [];
            displayLogs(history);
        });
    });

    function updateStatus(enabled) {
        statusIndicator.className = enabled ? 'status-indicator' : 'status-indicator off';
        toggleBtn.textContent = enabled ? 'Disable Protection' : 'Enable Protection';
    }

    function updateStats(stats) {
        totalScansEl.textContent = stats.total || 0;
        blockedCountEl.textContent = stats.blocked || 0;
        
        // Calculate success rate
        const successRate = stats.total > 0 ? ((stats.total - stats.blocked) / stats.total * 100).toFixed(1) : 100;
        
        // Add success rate to stats if not already present
        if (!document.getElementById('successRate')) {
            const statsDiv = document.querySelector('.stats');
            const successRateDiv = document.createElement('div');
            successRateDiv.className = 'stat-item';
            successRateDiv.innerHTML = `
                <span class="stat-number" id="successRate">${successRate}%</span>
                <span class="stat-label">Success Rate</span>
            `;
            statsDiv.appendChild(successRateDiv);
        } else {
            document.getElementById('successRate').textContent = successRate + '%';
        }
    }

    function displayLogs(history) {
        if (logsDiv.style.display === 'none') {
            logsDiv.style.display = 'block';
            viewLogsBtn.textContent = 'Hide Activity';
            
            logsDiv.innerHTML = '';
            const recentLogs = history.slice(-15).reverse(); // Show last 15
            
            if (recentLogs.length === 0) {
                logsDiv.innerHTML = '<div class="log-entry">No activity yet</div>';
                return;
            }
            
            recentLogs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = `log-entry ${log.result}`;
                
                const time = new Date(log.timestamp).toLocaleTimeString();
                const date = new Date(log.timestamp).toLocaleDateString();
                const text = log.text.length > 40 ? log.text.substring(0, 40) + '...' : log.text;
                
                let mlInfo = '';
                if (log.ml_prediction) {
                    mlInfo = `<br><small style="color: #ff6b6b;">ML: ${log.ml_prediction}</small>`;
                }
                if (log.confidence) {
                    const confidence = Math.round(log.confidence * 100);
                    mlInfo += `<br><small style="color: #ff8800;">Confidence: ${confidence}%</small>`;
                }
                if (log.malicious_probability) {
                    const prob = Math.round(log.malicious_probability * 100);
                    mlInfo += `<br><small style="color: #ff4444;">Malicious: ${prob}%</small>`;
                }
                
                logEntry.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <strong style="color: ${log.result === 'malicious' ? '#ff4444' : '#28a745'};">
                            ${log.result === 'malicious' ? 'Blocked' : 'Safe'}
                        </strong>
                        <span style="margin-left: auto; font-size: 12px; color: #666;">
                            ${time}
                        </span>
                    </div>
                    <div style="margin-bottom: 5px; font-size: 13px;">
                        ${text}
                    </div>
                    <div style="font-size: 11px; color: #888;">
                        ${date}${mlInfo}
                    </div>
                `;
                logsDiv.appendChild(logEntry);
            });
        } else {
            logsDiv.style.display = 'none';
            viewLogsBtn.textContent = 'View Recent Activity';
        }
    }

    // Auto-refresh stats every 1 second
    setInterval(function() {
        chrome.storage.local.get(['stats'], function(data) {
            updateStats(data.stats || { total: 0, blocked: 0 });
        });
    }, 1000);
    
    // Also refresh when popup opens
    chrome.storage.local.get(['stats'], function(data) {
        updateStats(data.stats || { total: 0, blocked: 0 });
    });
});
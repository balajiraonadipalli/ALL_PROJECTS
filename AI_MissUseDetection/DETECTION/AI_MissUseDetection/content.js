// AI Misuse Detection Content Script
console.log('=== AI Misuse Detection extension loaded! ===');

// Check if extension context is valid
function isExtensionContextValid() {
    try {
        return chrome && chrome.runtime && chrome.runtime.id;
    } catch (error) {
        return false;
    }
}

// Safe message sending function
function sendMessageToBackground(message, callback) {
    if (!isExtensionContextValid()) {
        console.log('Extension context invalid, skipping message:', message);
        return;
    }
    
    try {
        chrome.runtime.sendMessage(message, function(response) {
            if (chrome.runtime.lastError) {
                console.log('Runtime error:', chrome.runtime.lastError);
                return;
            }
            if (callback) callback(response);
        });
    } catch (error) {
        console.log('Error sending message to background:', error);
    }
}

// Enhanced element detection for chatbots and AI interfaces
function findChatElements() {
    const selectors = [
        // Traditional inputs
        'input[type="text"]',
        'input[type="email"]',
        'input[type="search"]',
        'input[type="url"]',
        'textarea',
        
        // Contenteditable elements (common in chatbots)
        '[contenteditable="true"]',
        '[contenteditable]',
        
        // Common chatbot selectors
        '[data-testid*="chat"]',
        '[data-testid*="input"]',
        '[data-testid*="message"]',
        '[data-testid*="prompt"]',
        '[data-testid*="composer"]',
        
        // ChatGPT specific
        '[data-id="root"] textarea',
        '[data-id="root"] [contenteditable]',
        '#prompt-textarea',
        '.prompt-textarea',
        '[placeholder*="Message"]',
        '[placeholder*="Send a message"]',
        '[placeholder*="Ask me anything"]',
        
        // Claude specific
        '[data-testid="composer-input"]',
        '[data-testid="composer-textarea"]',
        
        // Bard/Gemini specific
        '[data-testid="chat-input"]',
        '[data-testid="input-box"]',
        
        // Generic AI chat patterns
        '.chat-input',
        '.message-input',
        '.prompt-input',
        '.composer',
        '.input-area',
        '.chat-composer',
        '.message-composer',
        
        // Role-based selectors
        '[role="textbox"]',
        '[role="combobox"]',
        '[role="searchbox"]',
        
        // Common class patterns
        '.ProseMirror',
        '.ql-editor',
        '.DraftEditor-root',
        '.public-DraftEditor-content',
        
        // Iframe content (for embedded chatbots)
        'iframe'
    ];
    
    let elements = [];
    
    // Find elements using selectors
    selectors.forEach(selector => {
        try {
            const found = document.querySelectorAll(selector);
            elements = elements.concat(Array.from(found));
        } catch (error) {
            console.log('Selector error:', selector, error);
        }
    });
    
    // Also check for elements with common chatbot attributes
    const chatbotElements = document.querySelectorAll('*');
    chatbotElements.forEach(element => {
        const attributes = element.getAttributeNames();
        const text = element.textContent || '';
        
        // Check for chatbot-related attributes
        const hasChatAttr = attributes.some(attr => 
            attr.toLowerCase().includes('chat') ||
            attr.toLowerCase().includes('message') ||
            attr.toLowerCase().includes('prompt') ||
            attr.toLowerCase().includes('input') ||
            attr.toLowerCase().includes('composer')
        );
        
        // Check for placeholder text that suggests chat functionality
        const placeholder = element.getAttribute('placeholder') || '';
        const isChatPlaceholder = placeholder.toLowerCase().includes('message') ||
                                 placeholder.toLowerCase().includes('ask') ||
                                 placeholder.toLowerCase().includes('type') ||
                                 placeholder.toLowerCase().includes('send');
        
        // Check if element looks like a chat input
        const isLikelyChatInput = (
            (element.tagName === 'DIV' || element.tagName === 'TEXTAREA') &&
            (hasChatAttr || isChatPlaceholder || text.length > 0) &&
            !elements.includes(element)
        );
        
        if (isLikelyChatInput) {
            elements.push(element);
        }
    });
    
    // Remove duplicates
    elements = [...new Set(elements)];
    
    console.log('Found chat elements:', elements.length);
    return elements;
}

// Monitor iframe content for chatbots
function monitorIframes() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            if (iframe.contentDocument) {
                console.log('Monitoring iframe:', iframe.src);
                const iframeElements = findChatElements.call(iframe.contentDocument);
                iframeElements.forEach(element => {
                    observeElement(element);
                });
            }
        } catch (error) {
            // Cross-origin iframe, can't access content
            console.log('Cannot access iframe content (cross-origin):', iframe.src);
        }
    });
}

// ML-based content analysis
async function analyzeTextWithML(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: 'analyzeText',
            text: text
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Error in ML analysis:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

// Context-aware content analysis (fallback)
function analyzeContentContext(text) {
    const lowerText = text.toLowerCase();
    
    // Define malicious patterns with context
    const maliciousPatterns = [
        // Deepfake creation patterns
        {
            keywords: ['deepfake', 'fake video', 'fake image'],
            context: ['create', 'generate', 'make', 'produce', 'build'],
            intent: 'deepfake_creation',
            severity: 'high'
        },
        // Scam patterns
        {
            keywords: ['scam', 'phishing', 'fraud'],
            context: ['create', 'send', 'email', 'message', 'trick'],
            intent: 'scam_creation',
            severity: 'high'
        },
        // Malware patterns
        {
            keywords: ['malware', 'virus', 'trojan', 'ransomware'],
            context: ['create', 'develop', 'write', 'code'],
            intent: 'malware_creation',
            severity: 'critical'
        },
        // Impersonation patterns
        {
            keywords: ['pretend', 'impersonate', 'fake identity'],
            context: ['be', 'act', 'pose', 'pretend'],
            intent: 'impersonation',
            severity: 'medium'
        },
        // Misinformation patterns
        {
            keywords: ['fake news', 'false information', 'misinformation'],
            context: ['create', 'spread', 'share', 'publish'],
            intent: 'misinformation',
            severity: 'medium'
        },
        // Harmful instructions
        {
            keywords: ['hack', 'exploit', 'breach', 'attack'],
            context: ['how to', 'tutorial', 'guide', 'instructions'],
            intent: 'harmful_instructions',
            severity: 'high'
        }
    ];
    
    // Check for malicious patterns
    for (const pattern of maliciousPatterns) {
        const hasKeyword = pattern.keywords.some(keyword => lowerText.includes(keyword));
        const hasContext = pattern.context.some(context => lowerText.includes(context));
        
        if (hasKeyword && hasContext) {
            return {
                isMalicious: true,
                intent: pattern.intent,
                severity: pattern.severity,
                detectedPattern: pattern,
                confidence: 0.9
            };
        }
    }
    
    // Check for suspicious combinations
    const suspiciousCombinations = [
        {
            words: ['create', 'fake'],
            intent: 'fake_content_creation',
            severity: 'medium'
        },
        {
            words: ['generate', 'false'],
            intent: 'false_content_generation',
            severity: 'medium'
        },
        {
            words: ['trick', 'someone'],
            intent: 'deception',
            severity: 'medium'
        }
    ];
    
    for (const combo of suspiciousCombinations) {
        const hasAllWords = combo.words.every(word => lowerText.includes(word));
        if (hasAllWords) {
            return {
                isMalicious: true,
                intent: combo.intent,
                severity: combo.severity,
                detectedPattern: combo,
                confidence: 0.7
            };
        }
    }
    
    // Check for educational/defensive context (should be allowed)
    const educationalContexts = [
        'how to detect',
        'how to prevent',
        'how to avoid',
        'how to protect',
        'how to identify',
        'warning about',
        'awareness of',
        'education about',
        'research on',
        'study of'
    ];
    
    const hasEducationalContext = educationalContexts.some(context => lowerText.includes(context));
    if (hasEducationalContext) {
        return {
            isMalicious: false,
            intent: 'educational',
            severity: 'none',
            confidence: 0.8
        };
    }
    
    // Check for harmless contexts
    const harmlessContexts = [
        'movie about',
        'story about',
        'article about',
        'discussion about',
        'debate about',
        'news about',
        'report about'
    ];
    
    const hasHarmlessContext = harmlessContexts.some(context => lowerText.includes(context));
    if (hasHarmlessContext) {
        return {
            isMalicious: false,
            intent: 'harmless_discussion',
            severity: 'none',
            confidence: 0.6
        };
    }
    
    return {
        isMalicious: false,
        intent: 'unknown',
        severity: 'none',
        confidence: 0.5
    };
}

// Extract text from various element types
function extractTextFromElement(element) {
    if (element.contentEditable === 'true' || element.contentEditable === '') {
        return element.textContent || element.innerText || '';
    } else if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        return element.value || '';
    } else if (element.tagName === 'DIV' || element.tagName === 'P' || element.tagName === 'SPAN') {
        return element.textContent || element.innerText || '';
    }
    return '';
}

// Observe and monitor an element
function observeElement(element) {
    if (element.hasAttribute('data-ai-detector-monitored')) {
        return; // Already monitored
    }
    
    element.setAttribute('data-ai-detector-monitored', 'true');
    
    // Add visual indicator
    element.style.border = '1px solid #e0e0e0';
    element.style.transition = 'border-color 0.3s ease';
    
    console.log('Monitoring element:', element.tagName, element.className);
    
    // Add input event listeners
    const events = ['input', 'keyup', 'paste', 'drop'];
    events.forEach(eventType => {
        element.addEventListener(eventType, handleElementInput, true);
    });
    
    // For contenteditable elements, also monitor focus and blur
    if (element.contentEditable === 'true' || element.contentEditable === '') {
        element.addEventListener('focus', () => {
            console.log('Contenteditable element focused:', element);
        });
    }
}

// Handle input from any monitored element
function handleElementInput(e) {
    // Check if protection is enabled
    if (!protectionEnabled) {
        console.log('Protection disabled, skipping analysis');
        return;
    }
    
    const element = e.target;
    
    // Store original styling before any modifications
    storeOriginalStyle(element);
    
    const text = extractTextFromElement(element);
    
    if (text.length > 10) { // Only analyze substantial text
        console.log('=== Element input changed: ===', text.substring(0, 50));
        
        // Use ML analysis for real-time detection
        console.log('=== Starting ML analysis for text: ===', text.substring(0, 50));
        analyzeTextWithML(text).then(analysis => {
            console.log('Element ML analysis result:', analysis);
            
            if (analysis.result === 'malicious') {
                // Clear the harmful content immediately
                if (element.contentEditable === 'true' || element.contentEditable === '') {
                    element.textContent = '';
                    element.innerHTML = '';
                } else {
                    element.value = '';
                }
                
                // Show visual feedback
                element.style.border = '2px solid #ff4444';
                element.style.backgroundColor = '#fff0f0';
                
                // Show notification with ML results
                const confidence = Math.round(analysis.confidence * 100);
                showNotification(`Malicious content detected and cleared! (${confidence}% confidence)`);
                
                console.log('⚠️ Harmful content detected and cleared:', text);
                
                // Log to background script
                console.log('Sending malicious log to background from element...');
                sendMessageToBackground({
                    action: 'logAttempt',
                    payload: {
                        result: 'malicious',
                        text: text,
                        timestamp: Date.now(),
                        url: window.location.href,
                        ml_prediction: analysis.ml_prediction,
                        confidence: analysis.confidence,
                        malicious_probability: analysis.malicious_probability,
                        elementType: element.tagName,
                        isContentEditable: element.contentEditable === 'true'
                    }
                }, function(response) {
                    console.log('Element log response:', response);
                });
                
                // Reset styling after 3 seconds
                setTimeout(() => {
                    restoreOriginalStyle(element);
                }, 3000);
                
            } else {
                // Don't apply any styling for safe content - leave element as is
                console.log('Content is safe, no visual feedback needed');
            }
        }).catch(error => {
            console.error('Error in ML analysis:', error);
            // Don't apply any styling on error - leave element as is
        });
    }
}

// Run immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtension);
} else {
    initExtension();
}

function initExtension() {
    console.log('=== Initializing extension... ===');
    
    // Check if extension is still valid
    if (!isExtensionContextValid()) {
        console.log('Extension context invalid, stopping initialization');
        return;
    }
    
    // Load initial protection status
    chrome.storage.local.get(['protectionEnabled'], function(data) {
        protectionEnabled = data.protectionEnabled !== false; // Default to true
        console.log('Initial protection status:', protectionEnabled ? 'ENABLED' : 'DISABLED');
        
        // Clean up any existing styling from previous loads
        removeAllExtensionStyling();
    });
    
    // Find and monitor all chat elements
    const chatElements = findChatElements();
    chatElements.forEach(element => {
        observeElement(element);
    });
    
    // Monitor iframes
    monitorIframes();
    
    // Test message to background script
    sendMessageToBackground({action: 'test', message: 'Content script is working!'}, function(response) {
        console.log('Background script response:', response);
    });
    
    // Monitor for dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the new element is a chat element
                    const newChatElements = findChatElements.call(node.ownerDocument || document);
                    newChatElements.forEach(element => {
                        if (!element.hasAttribute('data-ai-detector-monitored')) {
                            observeElement(element);
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Add form submission handler for traditional forms
    document.addEventListener('submit', async function(e) {
        // Check if protection is enabled
        if (!protectionEnabled) {
            console.log('Protection disabled, allowing form submission');
            return;
        }
        
        console.log('=== Form submitted! ===');
        
        const form = e.target;
        const textInputs = form.querySelectorAll('input[type="text"], textarea');
        
        for (const input of textInputs) {
            const text = extractTextFromElement(input);
            if (text.trim()) {
                console.log('Analyzing text:', text);
                
                // Send text to background script for ML analysis
                const analysis = await analyzeTextWithML(text);
                console.log('ML Content analysis:', analysis);
                
                if (analysis.result === 'malicious') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Store original styling and show warning
                    storeOriginalStyle(input);
                    input.style.border = '2px solid red';
                    input.style.backgroundColor = '#fff0f0';
                    
                    // Show notification with ML results
                    const confidence = Math.round(analysis.confidence * 100);
                    showNotification(`Malicious content detected! (${confidence}% confidence)`);
                    
                    // Log to background script
                    console.log('Sending malicious log to background...');
                    sendMessageToBackground({
                        action: 'logAttempt',
                        payload: {
                            result: 'malicious',
                            text: text,
                            timestamp: Date.now(),
                            url: window.location.href,
                            ml_prediction: analysis.ml_prediction,
                            confidence: analysis.confidence,
                            malicious_probability: analysis.malicious_probability
                        }
                    }, function(response) {
                        console.log('Log attempt response:', response);
                    });
                    
                    console.log('Blocked harmful content:', text);
                    return false;
                }
            }
        }
        
        // Log safe submission
        console.log('Sending safe log to background...');
        sendMessageToBackground({
            action: 'logAttempt',
            payload: {
                result: 'safe',
                text: 'Form submission',
                timestamp: Date.now(),
                url: window.location.href
            }
        }, function(response) {
            console.log('Safe log response:', response);
        });
        
        console.log('Form submission allowed');
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-left: auto;
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
            ">×</button>
        </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Global variable to track protection status
let protectionEnabled = true;

// Store original element styles to restore them later
const originalStyles = new Map();

// Function to store original element styling
function storeOriginalStyle(element) {
    if (!originalStyles.has(element)) {
        originalStyles.set(element, {
            border: element.style.border,
            backgroundColor: element.style.backgroundColor,
            outline: element.style.outline
        });
    }
}

// Function to restore original element styling
function restoreOriginalStyle(element) {
    const original = originalStyles.get(element);
    if (original) {
        element.style.border = original.border;
        element.style.backgroundColor = original.backgroundColor;
        element.style.outline = original.outline;
    } else {
        // If no original style stored, clear all styling
        element.style.border = '';
        element.style.backgroundColor = '';
        element.style.outline = '';
    }
}

// Function to clear all element styling when protection is disabled
function clearAllElementStyling() {
    // Clear styling from all monitored elements
    const chatElements = findChatElements();
    chatElements.forEach(element => {
        restoreOriginalStyle(element);
    });
    
    // Also clear styling from all elements that might have been affected
    const allElements = document.querySelectorAll('input, textarea, [contenteditable], [role="textbox"]');
    allElements.forEach(element => {
        // Remove any borders and backgrounds that might be from our extension
        if (element.style.border && element.style.border.includes('#ff4444')) {
            element.style.border = '';
        }
        if (element.style.border && element.style.border.includes('#e0e0e0')) {
            element.style.border = '';
        }
        if (element.style.backgroundColor && element.style.backgroundColor.includes('#fff0f0')) {
            element.style.backgroundColor = '';
        }
        // Remove any outline that might be causing lines
        if (element.style.outline) {
            element.style.outline = '';
        }
    });
    
    console.log('Cleared styling from all monitored elements and potential affected elements');
}

// Function to aggressively remove all extension styling
function removeAllExtensionStyling() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        // Remove borders that look like they came from our extension
        if (element.style.border && (
            element.style.border.includes('#ff4444') || 
            element.style.border.includes('#e0e0e0') ||
            element.style.border.includes('red') ||
            element.style.border.includes('1px solid')
        )) {
            element.style.border = '';
        }
        
        // Remove backgrounds that came from our extension
        if (element.style.backgroundColor && element.style.backgroundColor.includes('#fff0f0')) {
            element.style.backgroundColor = '';
        }
        
        // Remove any outline
        if (element.style.outline) {
            element.style.outline = '';
        }
    });
    console.log('Aggressively removed all potential extension styling');
}

// Listen for messages from popup
if (isExtensionContextValid()) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('Content script received message:', request);
        
        if (request.action === 'toggleProtection') {
            protectionEnabled = request.enabled;
            console.log('Protection toggled:', protectionEnabled ? 'ON' : 'OFF');
            
            if (!protectionEnabled) {
                // Remove any active monitoring and clear all styling
                console.log('Protection disabled - stopping monitoring');
                removeAllExtensionStyling();
            } else {
                console.log('Protection enabled - resuming monitoring');
                removeAllExtensionStyling(); // Clean slate when enabling
            }
        }
        
        sendResponse({status: 'received', protectionEnabled: protectionEnabled});
    });
}

// Add a global function for manual cleanup (can be called from console)
window.clearExtensionStyling = function() {
    removeAllExtensionStyling();
    console.log('Manual styling cleanup executed');
};

console.log('=== Content script setup complete ===');
console.log('💡 Tip: Run clearExtensionStyling() in console to manually remove styling');

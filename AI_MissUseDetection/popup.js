document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle');
  const statusDiv = document.getElementById('status');
  
  // Load the current status
  chrome.storage.local.get(['sentimentAnalysisActive'], function(result) {
    const isActive = result.sentimentAnalysisActive || false;
    updateUI(isActive);
  });
  
  // Toggle activation
  toggleButton.addEventListener('click', function() {
    chrome.storage.local.get(['sentimentAnalysisActive'], function(result) {
      const newStatus = !(result.sentimentAnalysisActive || false);
      chrome.storage.local.set({sentimentAnalysisActive: newStatus}, function() {
        updateUI(newStatus);
        
        // Send message to content script to update its status
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'setActiveStatus',
            active: newStatus
          });
        });
      });
    });
  });
  
  function updateUI(isActive) {
    if (isActive) {
      statusDiv.textContent = 'Active';
      statusDiv.className = 'status active';
      toggleButton.textContent = 'Deactivate';
    } else {
      statusDiv.textContent = 'Inactive';
      statusDiv.className = 'status inactive';
      toggleButton.textContent = 'Activate';
    }
  }
});
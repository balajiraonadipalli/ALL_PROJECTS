// Track active status
let isActive = false;

// Listen for activation status changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'setActiveStatus') {
    isActive = request.active;
    if (isActive) {
      setupInputListeners();
    } else {
      removeInputListeners();
    }
  }
});

// Check initial status
chrome.storage.local.get(['sentimentAnalysisActive'], function(result) {
  isActive = result.sentimentAnalysisActive || false;
  if (isActive) {
    setupInputListeners();
  }
});

function setupInputListeners() {
  // Add event listeners to all input and textarea elements
  document.querySelectorAll('input, textarea').forEach(element => {
    if (!element.hasAttribute('data-sentiment-listener')) {
      element.setAttribute('data-sentiment-listener', 'true');
      element.addEventListener('blur', handleInputBlur);
      element.addEventListener('keydown', handleInputKeydown);
    }
  });
  
  // Also set up a mutation observer to handle dynamically added inputs
  if (!window.sentimentObserver) {
    window.sentimentObserver = new MutationObserver(function(mutations) {
      if (isActive) {
        setupInputListeners();
      }
    });
    
    window.sentimentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

function removeInputListeners() {
  document.querySelectorAll('[data-sentiment-listener]').forEach(element => {
    element.removeEventListener('blur', handleInputBlur);
    element.removeEventListener('keydown', handleInputKeydown);
    element.removeAttribute('data-sentiment-listener');
  });
}

function handleInputBlur(event) {
  if (!isActive) return;
  
  const text = event.target.value;
  if (text && text.trim().length > 0) {
    analyzeSentiment(text, event.target);
  }
}

function handleInputKeydown(event) {
  if (event.key === 'Enter' && isActive) {
    const text = event.target.value;
    if (text && text.trim().length > 0) {
      analyzeSentiment(text, event.target);
    }
  }
}

function analyzeSentiment(text, inputElement) {
  // Send message to background script for analysis
  chrome.runtime.sendMessage({
    action: 'analyzeSentiment',
    text: text
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }
    
    if (response && response.sentiment === 'negative') {
      showWarning(response.message, inputElement);
    }
  });
}

function showWarning(message, inputElement) {
  // Create warning popup
  const warningDiv = document.createElement('div');
  warningDiv.style.position = 'fixed';
  warningDiv.style.top = '50%';
  warningDiv.style.left = '50%';
  warningDiv.style.transform = 'translate(-50%, -50%)';
  warningDiv.style.backgroundColor = '#ffebee';
  warningDiv.style.border = '2px solid #f44336';
  warningDiv.style.borderRadius = '8px';
  warningDiv.style.padding = '20px';
  warningDiv.style.zIndex = '10000';
  warningDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  warningDiv.style.maxWidth = '300px';
  warningDiv.style.textAlign = 'center';
  
  // Add message
  const messageP = document.createElement('p');
  messageP.textContent = message;
  messageP.style.margin = '0 0 15px 0';
  messageP.style.color = '#c62828';
  warningDiv.appendChild(messageP);
  
  // Add OK button
  const okButton = document.createElement('button');
  okButton.textContent = 'OK';
  okButton.style.backgroundColor = '#f44336';
  okButton.style.color = 'white';
  okButton.style.border = 'none';
  okButton.style.borderRadius = '4px';
  okButton.style.padding = '8px 16px';
  okButton.style.cursor = 'pointer';
  
  okButton.addEventListener('click', function() {
    // Clear the input field
    inputElement.value = '';
    // Remove the warning
    document.body.removeChild(warningDiv);
    // Focus back on the input
    inputElement.focus();
  });
  
  warningDiv.appendChild(okButton);
  
  // Add to document
  document.body.appendChild(warningDiv);
  
  // Add overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.zIndex = '9999';
  document.body.appendChild(overlay);
  
  // Remove both when button is clicked
  okButton.addEventListener('click', function() {
    document.body.removeChild(warningDiv);
    document.body.removeChild(overlay);
  });
}
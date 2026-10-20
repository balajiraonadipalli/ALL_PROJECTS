// Listen for sentiment analysis requests
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'analyzeSentiment') {
    analyzeSentiment(request.text, sendResponse);
    return true; // Indicates we wish to send a response asynchronously
  }
});

function analyzeSentiment(text, callback) {
  // Replace with your actual server endpoint
  const serverUrl = 'https://localhost:5000/analyze';
  
  // Mock implementation - replace with actual API call
  // For demonstration, we'll use a simple rule-based approach
  setTimeout(() => {
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'dislike', 'suck', 'sucks'];
    const positiveWords = ['love', 'great', 'awesome', 'good', 'excellent', 'like', 'wonderful', 'fantastic'];
    
    let negativeCount = 0;
    let positiveCount = 0;
    
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (negativeWords.includes(word)) negativeCount++;
      if (positiveWords.includes(word)) positiveCount++;
    });
    
    if (negativeCount > positiveCount) {
      callback({
        sentiment: 'negative',
        message: 'Negative content detected. Your input has been cleared.'
      });
    } else {
      callback({
        sentiment: 'positive',
        message: 'Content is positive. No action needed.'
      });
    }
    
    /*
    // Actual implementation would be something like:
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
      callback(data);
    })
    .catch(error => {
      console.error('Error:', error);
      callback({ sentiment: 'error', message: 'Analysis failed' });
    });
    */
  }, 500); // Simulate network delay
}
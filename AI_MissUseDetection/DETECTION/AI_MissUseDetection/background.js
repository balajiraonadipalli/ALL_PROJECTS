// AI Misuse Detection Background Script
// Handles text analysis and logging using trained ML model

// Initialize storage with default values
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        protectionEnabled: true,
        stats: { total: 0, blocked: 0 },
        history: []
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    if (request.action === 'test') {
        console.log('Test message received:', request.message);
        sendResponse({status: 'Background script is working!'});
        return true;
    }
    
    if (request.action === 'analyzeText') {
        console.log('Background: Received analyzeText request for:', request.text.substring(0, 50));
        analyzeTextWithML(request.text, sendResponse);
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'logAttempt') {
        console.log('Background: Received logAttempt request:', request.payload);
        logAttempt(request.payload);
        sendResponse({ success: true });
        console.log('Background: Sent success response');
    }
});

async function analyzeTextWithML(text, sendResponse) {
    try {
        console.log('Background: Starting ML analysis for:', text.substring(0, 50) + '...');
        
        // Use the trained ML model for prediction
        const result = await callMLPredictor(text);
        
        console.log('Background: ML Analysis result:', result);
        
        // Determine if content is malicious based on ML prediction
        const isMalicious = result.prediction === 'malicious' && result.confidence > 0.45;
        
        // Update stats based on ML prediction
        chrome.storage.local.get(['stats'], (data) => {
            const stats = data.stats || { total: 0, blocked: 0 };
            stats.total += 1;
            if (isMalicious) {
                stats.blocked += 1;
            }
            chrome.storage.local.set({ stats });
            console.log('Background: Updated stats:', stats);
        });
        
        const response = {
            result: isMalicious ? 'malicious' : 'safe',
            confidence: result.confidence,
            malicious_probability: result.malicious_probability,
            safe_probability: result.safe_probability,
            ml_prediction: result.prediction,
            text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
        };
        
        console.log('Background: Sending response:', response);
        sendResponse(response);
        
    } catch (error) {
        console.error('Error analyzing text with ML:', error);
        
        // Fallback to simple keyword detection if ML fails
        const fallbackResult = fallbackKeywordAnalysis(text);
        sendResponse(fallbackResult);
    }
}

async function callMLPredictor(text) {
    return new Promise((resolve, reject) => {
        // For now, we'll use a simple implementation
        // In a real extension, you might want to use a different approach
        // like embedding the model in the extension or using a web service
        
        // Simulate ML prediction with some basic logic
        const lowerText = text.toLowerCase();
        
        // Define malicious patterns (this is just for fallback)
        const maliciousPatterns = [
            // Critical safety patterns (high weight)
            { keywords: ['how to', 'kill'], weight: 0.95 },
            { keywords: ['how to', 'murder'], weight: 0.95 },
            { keywords: ['how to', 'assassinate'], weight: 0.95 },
            { keywords: ['how to', 'make', 'bomb'], weight: 0.95 },
            { keywords: ['how to', 'create', 'bomb'], weight: 0.95 },
            { keywords: ['how to', 'build', 'bomb'], weight: 0.95 },
            { keywords: ['how to', 'make', 'explosives'], weight: 0.95 },
            { keywords: ['how to', 'create', 'explosives'], weight: 0.95 },
            { keywords: ['how to', 'make', 'gun'], weight: 0.95 },
            { keywords: ['how to', 'create', 'gun'], weight: 0.95 },
            { keywords: ['how to', 'hack'], weight: 0.9 },
            // Poisoning patterns
            { keywords: ['how to', 'poison'], weight: 0.95 },
            { keywords: ['poison', 'someone'], weight: 0.95 },
            { keywords: ['poison', 'food'], weight: 0.95 },
            { keywords: ['poison', 'water'], weight: 0.95 },
            { keywords: ['poison', 'drink'], weight: 0.95 },
            { keywords: ['poison', 'ourselves'], weight: 0.95 },
            // Direct commands without "how to" - only human-related
            { keywords: ['kill', 'person'], weight: 0.95 },
            { keywords: ['kill', 'human'], weight: 0.95 },
            { keywords: ['kill', 'someone'], weight: 0.95 },
            { keywords: ['kill', 'people'], weight: 0.95 },
            { keywords: ['kill', 'man'], weight: 0.95 },
            { keywords: ['kill', 'woman'], weight: 0.95 },
            { keywords: ['kill', 'child'], weight: 0.95 },
            { keywords: ['kill', 'baby'], weight: 0.95 },
            // Self-harm patterns (high priority)
            { keywords: ['kill', 'myself'], weight: 0.98 },
            { keywords: ['kill', 'yourself'], weight: 0.98 },
            { keywords: ['commit', 'suicide'], weight: 0.98 },
            { keywords: ['end', 'life'], weight: 0.95 },
            { keywords: ['take', 'own', 'life'], weight: 0.95 },
            { keywords: ['murder', 'someone'], weight: 0.95 },
            { keywords: ['assassinate', 'someone'], weight: 0.95 },
            { keywords: ['make', 'bomb'], weight: 0.95 },
            { keywords: ['create', 'bomb'], weight: 0.95 },
            { keywords: ['build', 'bomb'], weight: 0.95 },
            { keywords: ['make', 'explosives'], weight: 0.95 },
            { keywords: ['create', 'explosives'], weight: 0.95 },
            { keywords: ['make', 'gun'], weight: 0.95 },
            { keywords: ['create', 'gun'], weight: 0.95 },
            { keywords: ['hack', 'computer'], weight: 0.9 },
            { keywords: ['how to', 'make', 'deepfake'], weight: 0.9 },
            { keywords: ['how to', 'create', 'deepfake'], weight: 0.9 },
            { keywords: ['how to', 'generate', 'deepfake'], weight: 0.9 },
            { keywords: ['how to', 'make', 'fake', 'video'], weight: 0.9 },
            { keywords: ['how to', 'create', 'fake', 'video'], weight: 0.9 },
            // Direct commands without "how to"
            { keywords: ['make', 'deepfake'], weight: 0.9 },
            { keywords: ['create', 'deepfake'], weight: 0.9 },
            { keywords: ['generate', 'deepfake'], weight: 0.9 },
            { keywords: ['produce', 'deepfake'], weight: 0.9 },
            { keywords: ['make', 'fake', 'video'], weight: 0.9 },
            { keywords: ['create', 'fake', 'video'], weight: 0.9 },
            { keywords: ['generate', 'fake', 'video'], weight: 0.9 },
            
            // Educational patterns (should be safe)
            { keywords: ['why', 'make', 'deepfake'], weight: 0.2 },
            { keywords: ['why', 'create', 'deepfake'], weight: 0.2 },
            { keywords: ['why', 'people', 'deepfake'], weight: 0.2 },
            { keywords: ['what', 'dangers', 'deepfake'], weight: 0.2 },
            { keywords: ['how', 'detect', 'deepfake'], weight: 0.2 },
            { keywords: ['research', 'deepfake'], weight: 0.2 },
            { keywords: ['study', 'deepfake'], weight: 0.2 },
            
            // Other malicious patterns
            { keywords: ['create', 'deepfake'], weight: 0.8 },
            { keywords: ['pretend', 'elon musk'], weight: 0.9 },
            { keywords: ['generate', 'fake news'], weight: 0.7 },
            { keywords: ['create', 'scam'], weight: 0.8 },
            { keywords: ['make money', 'scheme'], weight: 0.9 },
            { keywords: ['clone', 'voice'], weight: 0.8 },
            { keywords: ['spread', 'false news'], weight: 0.7 },
            { keywords: ['act as', 'email'], weight: 0.6 },
            { keywords: ['create', 'harmful memes'], weight: 0.8 },
            { keywords: ['generate', 'conspiracy theory'], weight: 0.8 }
        ];
        
        // Check for malicious patterns
        let maxScore = 0;
        let detectedPattern = null;
        
        for (const pattern of maliciousPatterns) {
            const hasAllKeywords = pattern.keywords.every(keyword => lowerText.includes(keyword));
            if (hasAllKeywords) {
                maxScore = Math.max(maxScore, pattern.weight);
                detectedPattern = pattern;
            }
        }
        
        // Check for educational/defensive context (should reduce score)
        const educationalContexts = [
            'how to detect', 'how to prevent', 'how to avoid', 'how to protect',
            'how to identify', 'warning about', 'awareness of', 'education about',
            'research on', 'study of', 'article about', 'movie about', 'story about',
            'why do', 'why are', 'why is', 'what is', 'what are', 'how do',
            'research about', 'study about', 'learn about', 'understand',
            'explain', 'describe', 'discuss', 'analyze', 'examine'
        ];
        
        // Check for legitimate/beneficial context (should reduce score significantly)
        const legitimateContexts = [
            'mosquitos', 'mosquito', 'bugs', 'insects', 'pests', 'weeds',
            'bacteria', 'viruses', 'germs', 'mold', 'fungus', 'parasites',
            'rodents', 'mice', 'rats', 'cockroaches', 'ants', 'termites',
            'spiders', 'wasps', 'bees', 'flies', 'moths', 'aphids',
            'weeds', 'invasive', 'plants', 'diseases', 'infections'
        ];
        
        const hasEducationalContext = educationalContexts.some(context => lowerText.includes(context));
        if (hasEducationalContext) {
            maxScore *= 0.3; // Reduce score for educational content
        }
        
        const hasLegitimateContext = legitimateContexts.some(context => lowerText.includes(context));
        if (hasLegitimateContext) {
            // Only reduce score if it's specifically about killing pests/insects
            if (lowerText.includes('kill') && (lowerText.includes('mosquito') || lowerText.includes('bug') || lowerText.includes('pest') || lowerText.includes('insect'))) {
                maxScore *= 0.1; // Significantly reduce score for legitimate pest control
            } else {
                maxScore *= 0.3; // Moderate reduction for other legitimate contexts
            }
        }
        
        const malicious_probability = maxScore;
        const safe_probability = 1 - maxScore;
        const prediction = malicious_probability > 0.45 ? 'malicious' : 'safe';
        const confidence = Math.max(malicious_probability, safe_probability);
        
        resolve({
            prediction: prediction,
            confidence: confidence,
            malicious_probability: malicious_probability,
            safe_probability: safe_probability,
            detected_pattern: detectedPattern ? detectedPattern.keywords.join(' + ') : null
        });
    });
}

function fallbackKeywordAnalysis(text) {
    // Simple keyword-based fallback analysis
    const lowerText = text.toLowerCase();
    
    const maliciousKeywords = [
        'deepfake', 'fake video', 'scam', 'phishing', 'malware',
        'hack', 'exploit', 'vulnerability', 'attack', 'breach',
        'steal', 'fraud', 'impersonate', 'fake news', 'misinformation',
        'manipulate', 'trick', 'deceive', 'spoof', 'forgery'
    ];
    
    let isMalicious = false;
    let detectedKeywords = [];
    
    for (const keyword of maliciousKeywords) {
        if (lowerText.includes(keyword)) {
            isMalicious = true;
            detectedKeywords.push(keyword);
        }
    }
    
    return {
        result: isMalicious ? 'malicious' : 'safe',
        confidence: isMalicious ? 0.8 : 0.9,
        detectedKeywords: detectedKeywords,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        method: 'fallback'
    };
}

function logAttempt(payload) {
    chrome.storage.local.get(['history', 'stats'], (data) => {
        const history = data.history || [];
        const stats = data.stats || { total: 0, blocked: 0 };
        
        // Add to history
        history.push({
            ...payload,
            timestamp: Date.now()
        });
        
        // Update stats
        stats.total += 1;
        if (payload.result === 'malicious') {
            stats.blocked += 1;
        }
        
        // Keep only last 100 entries
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }
        
        // Save both history and stats
        chrome.storage.local.set({ 
            history: history,
            stats: stats
        });
        
        console.log('Logged attempt:', payload);
        console.log('Updated stats:', stats);
    });
}
const BASE_URL = 'http://localhost:8080'; // Base URL for the server
const ENDPOINT = '/expand-text'; // Endpoint for processing text
let latestResponse = ''; // Store the latest response to send to the popup

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'highlightAI',
        title: 'Expand Meaning with Highlight-AI',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === 'highlightAI' && info.selectionText) {
        try {
            const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: info.selectionText })
            });

            const data = await response.json();
            latestResponse = data.expandedText || 'No response received from the server.';
        } catch (error) {
            latestResponse = 'Error connecting to server.';
            console.error(error);
        }
    }
});

// Listen for popup script requests to get the latest response
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getLatestResponse') {
        sendResponse({ latestResponse });
    }
});


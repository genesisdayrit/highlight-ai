const BASE_URL = 'http://localhost:8080'; // Base URL for the server
const ENDPOINT = '/expand-text'; // Endpoint for processing text
let latestResponse = ''; // Store the latest response
let processing = false; // Track the processing state

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'highlightAI',
        title: 'Expand Meaning with Highlight-AI',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === 'highlightAI' && info.selectionText) {
        try {
            processing = true; // Start processing
            latestResponse = ''; // Reset the latest response

            // Notify popup that processing has started
            chrome.runtime.sendMessage({ type: 'stateUpdate', processing });

            // Make the API request
            const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: info.selectionText }),
            });

            const data = await response.json();
            latestResponse = data.expandedText || 'No response received from the server.';
        } catch (error) {
            latestResponse = 'Error connecting to the server.';
            console.error(error);
        } finally {
            processing = false; // Stop processing

            // Notify popup that processing has finished
            chrome.runtime.sendMessage({ type: 'stateUpdate', processing });
        }
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getLatestResponse') {
        sendResponse({ latestResponse, processing });
    } else if (request.type === 'setProcessing') {
        processing = true; // Set processing state
    }
});

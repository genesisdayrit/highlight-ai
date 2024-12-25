document.addEventListener('DOMContentLoaded', () => {
    // Request the latest response from the background script
    chrome.runtime.sendMessage({ type: 'getLatestResponse' }, (response) => {
        const responseElement = document.getElementById('response');
        if (response.latestResponse) {
            responseElement.textContent = response.latestResponse;
        } else {
            responseElement.textContent = 'No response received. Please try again.';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const responseElement = document.getElementById('response');

    const updateResponse = () => {
        chrome.runtime.sendMessage({ type: 'getLatestResponse' }, (response) => {
            const { latestResponse, processing } = response;

            if (processing) {
                // If processing, show "Generating response..."
                responseElement.textContent = 'Generating response...';
            } else if (latestResponse && latestResponse.trim() !== '') {
                // If there's a latest response, display it
                responseElement.textContent = latestResponse;
            } else {
                // Default message when no response is available
                responseElement.textContent = 'Highlight some text and click "Expand Meaning with Highlight-AI".';
            }
        });
    };

    // Update response once on popup load
    updateResponse();

    // Optionally, you can poll every second if dynamic updates are desired
    setInterval(updateResponse, 1000);
});

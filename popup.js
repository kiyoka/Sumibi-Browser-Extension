"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // Default message or state
        messageElement.textContent = '...';
    }

    // Show API endpoint and model name
    const endpointElem = document.getElementById('endpoint');
    const modelElem = document.getElementById('modelName');
    if (endpointElem) {
        endpointElem.textContent = 'https://api.openai.com/v1/chat/completions';
    }
    chrome.storage.local.get(['openai_model', 'textareaClicked'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Popup: error getting storage:', chrome.runtime.lastError);
            return;
        }
        if (modelElem) {
            modelElem.textContent = result.openai_model || 'gpt-4.1';
        }
        if (result.textareaClicked) {
            if (messageElement) {
                messageElement.textContent = 'click!';
            }
            chrome.storage.local.set({ textareaClicked: false }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Popup: error resetting textareaClicked:', chrome.runtime.lastError);
                }
            });
        }
    });
});

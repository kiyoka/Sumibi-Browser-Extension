"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const endpointElem = document.getElementById('endpoint');
    const modelElem = document.getElementById('modelName');
    if (endpointElem) {
        endpointElem.textContent = 'https://api.openai.com/v1/chat/completions';
    }
    chrome.storage.local.get(['openai_model'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Popup: error getting storage:', chrome.runtime.lastError);
            return;
        }
        if (modelElem) {
            modelElem.textContent = result.openai_model || 'gpt-4.1';
        }
    });
});

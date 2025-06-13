"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const endpointElem = document.getElementById('endpoint');
    const modelElem = document.getElementById('modelName');
    chrome.storage.local.get(
        ['openai_model', 'google_model', 'provider'],
        function(result) {
            const provider = result.provider === 'google' ? 'google' : 'openai';
            const endpoint = provider === 'google'
                ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';
            const model = provider === 'google'
                ? (result.google_model || getDefaultGoogleModel())
                : (result.openai_model || getDefaultOpenAIModel());
            if (endpointElem) endpointElem.textContent = endpoint;
            if (modelElem)    modelElem.textContent = model;
        }
    );
});

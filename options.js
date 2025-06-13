document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const modelInput = document.getElementById('model');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  chrome.storage.local.get(['openai_api_key', 'openai_model'], result => {
    if (result.openai_api_key) {
      apiKeyInput.value = result.openai_api_key;
    }
    modelInput.value = result.openai_model || getDefaultOpenAIModel();
  });

  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    const model = modelInput.value.trim();
    chrome.storage.local.set({ openai_api_key: key, openai_model: model }, () => {
      status.textContent = '保存しました';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });
});
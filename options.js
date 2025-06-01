document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  chrome.storage.local.get(['openai_api_key'], result => {
    if (result.openai_api_key) {
      apiKeyInput.value = result.openai_api_key;
    }
  });
  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    chrome.storage.local.set({ openai_api_key: key }, () => {
      status.textContent = '保存しました';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const providerOpenAI    = document.getElementById('provider-openai');
  const providerGoogle    = document.getElementById('provider-google');
  const openaiApiKeyInput = document.getElementById('openaiApiKey');
  const openaiModelInput  = document.getElementById('openaiModel');
  const geminiApiKeyInput = document.getElementById('geminiApiKey');
  const geminiModelInput  = document.getElementById('geminiModel');
  const saveBtn           = document.getElementById('saveBtn');
  const status            = document.getElementById('status');

  // 設定値の読み込み
  chrome.storage.local.get(
    ['openai_api_key','openai_model','google_api_key','google_model','provider'],
    result => {
      openaiApiKeyInput.value = result.openai_api_key || '';
      openaiModelInput.value  = result.openai_model || getDefaultOpenAIModel();
      geminiApiKeyInput.value = result.google_api_key || '';
      geminiModelInput.value  = result.google_model || getDefaultGoogleModel();
      const provider = result.provider === 'google' ? 'google' : 'openai';
      providerGoogle.checked  = provider === 'google';
      providerOpenAI.checked  = provider === 'openai';
    }
  );

  // 保存
  saveBtn.addEventListener('click', () => {
    const provider = providerGoogle.checked ? 'google' : 'openai';
    const toStore = {
      provider,
      openai_api_key: openaiApiKeyInput.value.trim(),
      openai_model:   openaiModelInput.value.trim(),
      google_api_key: geminiApiKeyInput.value.trim(),
      google_model:   geminiModelInput.value.trim()
    };
    chrome.storage.local.set(toStore, () => {
      status.textContent = '保存しました';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });
});
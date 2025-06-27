function getDefaultOpenAIModel() {
  return 'gpt-4.1';
}
/**
 * Google Gemini のデフォルトモデル名を返す
 */
function getDefaultGoogleModel() {
  return 'gemini-2.0-flash';
}

/**
 * プロバイダに応じたデフォルトモデル名を返す
 * @param {string} provider 'openai' または 'google'
 */
function getDefaultModel(provider) {
  return provider === 'google' ? getDefaultGoogleModel() : getDefaultOpenAIModel();
}
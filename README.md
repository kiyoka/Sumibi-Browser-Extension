# Sumibi-Browser-Extension

Japanese input method powered by ChatGPT API

[Sumibi](https://github.com/kiyoka/Sumibi)のブラウザ拡張版のリポジトリです。
sumibi.elと同様に、OpenAIのChatCompletion APIを使ってモードレスなローマ字日本語入力システムを実現するものです。

## 対応ブラウザ(予定)

- Google Chrome
- Microsoft Edge

## 主な機能(予定)
コンテンツ内のinput type=text、textarea、およびcontenteditable属性を持つdiv要素でローマ字日本語入力ができるようにする拡張です。
ローマ字から日本語に変換するロジックは、OpenAIのAPIで実現します。

## 設定
OpenAI APIキーと使用するChatCompletionモデル名は拡張機能のオプション画面から設定してください。

1. Chromeの拡張機能ページ（chrome://extensions/）で本拡張の「詳細」をクリックし、「拡張機能のオプション」を選択
2. 表示された設定画面でAPIキーとモデル名を入力し、「保存」をクリック

入力したAPIキーとモデル名はローカルストレージ（chrome.storage.local）に保存されます。
モデル名のデフォルトは `gpt-4.1` です。

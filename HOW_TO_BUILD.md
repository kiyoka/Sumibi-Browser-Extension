# Build Process

この拡張機能はビルド不要です。ソースコードをそのままアンパック済み拡張機能として読み込んでください。

# Debugging Process

1. **Load the Extension in Chrome:**
   - Open Google Chrome and navigate to `chrome://extensions`.
   - Enable "Developer mode" using the toggle switch in the top right corner.
   - Click on the "Load unpacked" button.
   - Select the project's root directory (the one containing `manifest.json`).

2. **Inspecting Popup Scripts:**
   - After loading the extension, click on its icon in the Chrome toolbar to open the popup.
   - Right-click inside the popup and select "Inspect". This will open the Chrome DevTools, where you can debug the popup scripts (`popup.js`).

3. **Inspecting Content Scripts:**
   - Content scripts (`content.js`) run on web pages. To debug them, open a web page where the extension is active.
   - Right-click on the page and select "Inspect" to open Chrome DevTools.
   - Go to the "Sources" tab. In the left-hand pane, under the "Content scripts" section (it might be nested under "Page" or similar), you should find your extension's content scripts. You can set breakpoints and debug them there.
   - You can also view `console.log` messages from content scripts in the "Console" tab of the DevTools for the web page.

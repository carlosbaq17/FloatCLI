async function requestPipWindow(extId) {
  if (window._vibeTerminalPiPActive) return;
  window._vibeTerminalPiPActive = true;

  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: 840,
    height: 620
  });
  
  window.vibePipWindow = pipWindow;

  const base = `chrome-extension://${extId}/pip/libs/`;

  const styleLinks = [
    base + 'xterm.css',
    `chrome-extension://${extId}/pip/style.css`
  ];

  for (const url of styleLinks) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const style = pipWindow.document.createElement('style');
      style.textContent = text;
      pipWindow.document.head.appendChild(style);
    } catch (e) {
      console.error('Error fetching CSS:', e);
    }
  }

  const extraStyle = pipWindow.document.createElement('style');
  extraStyle.textContent = `
    html, body { width: 100vw; height: 100vh; margin: 0; padding: 0; overflow: hidden; background-color: #1e1e1e; font-family: sans-serif; }
    
    #vibe-terminal-app {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
    
    #tab-bar {
      display: flex;
      background: #252526;
      border-bottom: 1px solid #1e1e1e;
      overflow-x: auto;
      user-select: none;
    }
    
    .vibe-tab {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #2d2d2d;
      color: #969696;
      border-right: 1px solid #1e1e1e;
      cursor: pointer;
      font-size: 13px;
      min-width: 100px;
    }
    
    .vibe-tab.active {
      background: #1e1e1e;
      color: #ffffff;
      border-top: 2px solid #007acc;
    }
    
    .vibe-tab-title {
      flex: 1;
      margin-right: 8px;
    }
    
    .vibe-tab-close {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: transparent;
      transition: background 0.2s, color 0.2s;
    }
    
    .vibe-tab:hover .vibe-tab-close, .vibe-tab.active .vibe-tab-close {
      color: #ccc;
    }
    
    .vibe-tab-close:hover {
      background: #ff5f56;
      color: white !important;
    }
    
    #add-tab-btn {
      background: transparent;
      color: #ccc;
      border: none;
      padding: 0 16px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    #add-tab-btn:hover {
      background: #333333;
      color: white;
    }
    
    #terminal-container {
      flex: 1;
      position: relative;
      background: #000000;
      padding: 5px;
    }
    
    .terminal-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
    }
    
    .terminal-wrapper.active {
      display: block;
    }
  `;
  pipWindow.document.head.appendChild(extraStyle);

  pipWindow.document.body.innerHTML = `
    <div id="vibe-terminal-app">
      <div id="tab-bar">
        <div id="tabs-list" style="display:flex;"></div>
        <button id="add-tab-btn" title="Nueva Terminal">+</button>
      </div>
      <div id="terminal-container"></div>
    </div>
  `;

  pipWindow.addEventListener('unload', () => {
    window._vibeTerminalPiPActive = false;
    window.vibePipWindow = null;
  });
}

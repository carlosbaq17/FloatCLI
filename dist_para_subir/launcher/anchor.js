document.getElementById('launch-btn').addEventListener('click', async () => {
  try {
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 800,
      height: 600
    });

    const styleLinks = [
      chrome.runtime.getURL('pip/libs/xterm.css'),
      chrome.runtime.getURL('pip/style.css')
    ];

    for (const href of styleLinks) {
      const response = await fetch(href);
      const cssText = await response.text();
      const style = pipWindow.document.createElement('style');
      style.textContent = cssText;
      pipWindow.document.head.appendChild(style);
    }

    // ELIMINADA PANTALLA COMPLETA (maximize-btn fuera)
    pipWindow.document.body.innerHTML = `
      <div id="vibe-terminal-app">
        <div id="tab-bar">
          <div id="tabs-list"></div>
          <button id="add-tab-btn" title="Nueva Terminal">+</button>
        </div>
        <div id="tabs-container"></div>
      </div>
    `;

    if (typeof window.initVibeApp === 'function') {
      window.initVibeApp(pipWindow);
    } else {
      // Error silencioso en producción
    }

  } catch (err) {
    alert("Error al intentar abrir el PiP: " + err.message);
  }
});

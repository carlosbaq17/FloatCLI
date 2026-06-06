document.getElementById('open-pip').addEventListener('click', async () => {
  try {
    // 1. IMPLEMENTACIÓN REAL DE DOCUMENT PiP
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 800,
      height: 600
    });

    // Copiar todos los <link rel="stylesheet"> y <style> al pipWindow.document.head
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      const cloned = pipWindow.document.createElement('link');
      cloned.rel = 'stylesheet';
      cloned.href = el.href; // El href ya es absoluto y se resuelve correctamente
      pipWindow.document.head.appendChild(cloned);
    });
    
    document.querySelectorAll('style').forEach(el => {
      pipWindow.document.head.appendChild(el.cloneNode(true));
    });

    // Inyectar la estructura HTML base de la terminal en pipWindow.document.body
    pipWindow.document.body.innerHTML = `
      <div id="toolbar">
        <button id="new-term-btn">+ Nueva Terminal</button>
      </div>
      <div id="desktop"></div>
    `;

    // Cargar los scripts dentro del contexto del PiP
    // Esto asegura que la lógica de WinBox y xterm se ejecute en el pipWindow.document
    const scripts = [
      'pip/libs/xterm.js',
      'pip/libs/xterm-addon-fit.js',
      'pip/libs/winbox.bundle.js',
      'pip/app.js'
    ];

    for (const src of scripts) {
      const script = pipWindow.document.createElement('script');
      script.src = chrome.runtime.getURL(src);
      await new Promise(resolve => {
        script.onload = resolve;
        script.onerror = () => {
          console.error('Error loading script:', src);
          resolve(); // continuar de todas formas
        };
        pipWindow.document.body.appendChild(script);
      });
    }
    
    // NOTA: No cerramos window.close() aquí, ya que cerrar la pestaña destruiría el PiP automáticamente.

  } catch (error) {
    console.error('Error al abrir Document PiP:', error);
    alert('Error al abrir la ventana PiP. Asegúrate de tener permisos o revisa la consola.');
  }
});

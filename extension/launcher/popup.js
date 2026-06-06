document.getElementById('open-btn').addEventListener('click', async () => {
  // 1. CREACIÓN DE LA VENTANA (Bottom-Left)
  const displays = await chrome.system.display.getInfo();
  // Busca el display primario o usa el primero
  const primary = displays.find(d => d.isPrimary) || displays[0];
  
  const width = 800;
  const height = 450;
  
  // Calcular posición esquina inferior izquierda
  const left = primary.workArea.left;
  const top = primary.workArea.top + primary.workArea.height - height;

  await chrome.windows.create({
    url: chrome.runtime.getURL("pip/index.html"),
    type: "popup", // Oculta barra de navegación y marcadores
    width,
    height,
    left,
    top
  });
  window.close();
});

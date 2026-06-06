chrome.action.onClicked.addListener((tab) => {
  // Al hacer clic en el icono de la extensión, lanzamos el "Tab Ancla"
  chrome.tabs.create({ url: "launcher/anchor.html" });
});

window.initVibeApp = function(pipWindow) {
  const pipDoc = pipWindow.document;
  const port = chrome.runtime.connectNative('com.floatcli.terminal');
  
  const tabs = new Map();
  let tabCounter = 1;
  let activeTabId = null;

  const terminals = new Map(); 

  port.onMessage.addListener((msg) => {
    if (msg.id && terminals.has(msg.id)) {
      const { term } = terminals.get(msg.id);
      if (msg.action === 'data') {
        term.write(msg.payload);
      }
    }
  });

  port.onDisconnect.addListener(() => {
    // Native host disconnected
  });

  const tabsList = pipDoc.getElementById('tabs-list');
  const tabsContainer = pipDoc.getElementById('tabs-container');
  const addTabBtn = pipDoc.getElementById('add-tab-btn');

  // 4. ACTUALIZACIÓN DEL RENOMBRADO (Doble Clic exclusivo a tabs)
  function handleRenameDblClick(el, promptText) {
    el.addEventListener('dblclick', () => {
      const newName = prompt(promptText, el.textContent);
      if (newName && newName.trim() !== '') {
        el.textContent = newName.trim();
      }
    });
  }

  function switchTab(tabId) {
    if (!tabs.has(tabId)) return;
    activeTabId = tabId;

    tabs.forEach((tabData, id) => {
      const isActive = id === activeTabId;
      if (isActive) {
        tabData.tabEl.classList.add('active');
        tabData.viewEl.classList.add('active');
        tabData.terminalIds.forEach(termId => {
          const t = terminals.get(termId);
          if (t) {
            try { t.fitAddon.fit(); } catch (e) {}
          }
        });
      } else {
        tabData.tabEl.classList.remove('active');
        tabData.viewEl.classList.remove('active');
      }
    });
  }

  function closeTab(tabId, event) {
    if (event) event.stopPropagation();
    if (!tabs.has(tabId)) return;
    
    const tabData = tabs.get(tabId);
    
    tabData.terminalIds.forEach(termId => {
      const t = terminals.get(termId);
      if (t) {
        t.observer.disconnect();
        port.postMessage({ id: termId, action: 'kill' });
        t.term.dispose();
        terminals.delete(termId);
      }
    });

    tabData.tabEl.remove();
    tabData.viewEl.remove();
    tabs.delete(tabId);
    
    if (activeTabId === tabId) {
      const remainingIds = Array.from(tabs.keys());
      if (remainingIds.length > 0) {
        switchTab(remainingIds[remainingIds.length - 1]);
      } else {
        activeTabId = null;
        pipWindow.close();
      }
    }
  }

  function createTab() {
    const tabId = crypto.randomUUID();
    // 2. NOMENCLATURA DE PESTAÑAS (Terminal X)
    const titleText = `Terminal ${tabCounter++}`;

    const tabEl = pipDoc.createElement('div');
    tabEl.className = 'vibe-tab';
    
    const titleEl = pipDoc.createElement('div');
    titleEl.className = 'vibe-tab-title';
    titleEl.textContent = titleText;
    titleEl.title = "Doble clic para renombrar";
    
    handleRenameDblClick(titleEl, "Nuevo nombre para la terminal:");
    
    const closeEl = pipDoc.createElement('div');
    closeEl.className = 'vibe-tab-close';
    closeEl.innerHTML = '×';
    
    tabEl.appendChild(titleEl);
    tabEl.appendChild(closeEl);
    tabsList.appendChild(tabEl);

    const viewEl = pipDoc.createElement('div');
    viewEl.className = 'tab-view';
    
    const rootContainer = pipDoc.createElement('div');
    rootContainer.className = 'split-container row';
    viewEl.appendChild(rootContainer);
    
    tabsContainer.appendChild(viewEl);

    tabs.set(tabId, { tabEl, viewEl, rootContainer, terminalIds: new Set() });

    tabEl.addEventListener('click', () => switchTab(tabId));
    closeEl.addEventListener('click', (e) => closeTab(tabId, e));

    createPanel(rootContainer, tabId);
    switchTab(tabId);
  }

  function createPanel(parentContainer, tabId) {
    const id = crypto.randomUUID();

    const panel = pipDoc.createElement('div');
    panel.className = 'panel';

    // 3. LIMPIEZA DE CABECERAS DE PANELES (SPLITS)
    const header = pipDoc.createElement('div');
    header.className = 'panel-header';

    const controls = pipDoc.createElement('div');
    controls.className = 'panel-controls';

    const btnSplitV = pipDoc.createElement('button');
    btnSplitV.className = 'panel-btn';
    btnSplitV.title = 'Split Horizontal';
    btnSplitV.innerHTML = '◫';
    
    const btnSplitH = pipDoc.createElement('button');
    btnSplitH.className = 'panel-btn';
    btnSplitH.title = 'Split Vertical';
    btnSplitH.innerHTML = '⬒';

    const btnClose = pipDoc.createElement('button');
    btnClose.className = 'panel-btn close';
    btnClose.title = 'Cerrar Panel';
    btnClose.innerHTML = '×';

    controls.appendChild(btnSplitV);
    controls.appendChild(btnSplitH);
    controls.appendChild(btnClose);

    header.appendChild(controls);

    const wrapper = pipDoc.createElement('div');
    wrapper.className = 'terminal-wrapper';

    panel.appendChild(header);
    panel.appendChild(wrapper);
    parentContainer.appendChild(panel);

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      theme: { background: '#000000', foreground: '#ffffff' }
    });

    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(wrapper);

    port.postMessage({
      id,
      action: 'create',
      payload: { cols: term.cols, rows: term.rows }
    });

    term.onData((data) => {
      port.postMessage({ id, action: 'data', payload: data });
    });

    let resizeTimeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        try {
          fitAddon.fit();
          port.postMessage({
            id,
            action: 'resize',
            payload: { cols: term.cols, rows: term.rows }
          });
        } catch (e) {}
      }, 50);
    });
    observer.observe(wrapper);

    setTimeout(() => fitAddon.fit(), 50);

    terminals.set(id, { term, fitAddon, panel, observer, tabId });
    if (tabs.has(tabId)) {
      tabs.get(tabId).terminalIds.add(id);
    }

    btnSplitV.addEventListener('click', () => {
      splitPanel(panel, 'row', tabId);
    });

    btnSplitH.addEventListener('click', () => {
      splitPanel(panel, 'column', tabId);
    });

    btnClose.addEventListener('click', () => {
      observer.disconnect();
      port.postMessage({ id, action: 'kill' });
      term.dispose();
      terminals.delete(id);
      
      if (tabs.has(tabId)) {
        tabs.get(tabId).terminalIds.delete(id);
      }
      
      const parent = panel.parentElement;
      panel.remove();
      
      if (parent.children.length === 0 && parent.classList.contains('split-container')) {
        const tabData = tabs.get(tabId);
        if (tabData && tabData.rootContainer === parent) {
          closeTab(tabId);
        } else {
          const grandParent = parent.parentElement;
          parent.remove();
          if (grandParent && grandParent.children.length === 0) {
            if (tabData && tabData.rootContainer === grandParent) {
              closeTab(tabId);
            }
          }
        }
      }
    });
  }

  function splitPanel(originalPanel, direction, tabId) {
    const parent = originalPanel.parentElement;
    
    if (parent.classList.contains(direction)) {
      createPanel(parent, tabId);
    } else {
      const newContainer = pipDoc.createElement('div');
      newContainer.className = `split-container ${direction}`;
      newContainer.style.flex = originalPanel.style.flex || "1";
      
      parent.replaceChild(newContainer, originalPanel);
      
      originalPanel.style.flex = "1";
      newContainer.appendChild(originalPanel);
      
      createPanel(newContainer, tabId);
    }
  }

  addTabBtn.addEventListener('click', createTab);

  createTab();
};

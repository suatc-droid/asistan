const { app, BrowserWindow, ipcMain, Menu, Tray, dialog, screen } = require('electron');
const path = require('path');

let mainWindow;
let mascotWindow;
let tray;

function startExpressServer() {
  try {
    const serverPath = path.join(__dirname, 'dist', 'server.cjs');
    
    // Set production environment variables
    process.env.NODE_ENV = 'production';
    process.env.PORT = '3000';
    
    // Load and run the compiled server directly in the same process
    require(serverPath);
    console.log("Express server loaded successfully inside main process!");
  } catch (error) {
    console.error("Failed to load express server internally:", error);
    dialog.showErrorBox(
      "Sunucu Başlatma Hatası",
      `Arka plan sunucusu başlatılamadı.\nHata Detayı: ${error.message}\n\nLütfen uygulamayı yönetici olarak çalıştırmayı deneyin veya sistem yöneticinize danışın.`
    );
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Kurumsal İş Asistanı & İş Akışı",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load local express server
  mainWindow.loadURL('http://localhost:3000');

  // Intercept window.open calls from React (such as view=mascot-only) and route them to our custom frameless transparent window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('view=mascot-only')) {
      createMascotWindow();
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Retry on connection/load failure (e.g. if express is still starting up)
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL.startsWith('http://localhost:3000')) {
      console.log('Main window failed to load, retrying in 500ms...');
      setTimeout(() => {
        if (mainWindow) {
          mainWindow.loadURL('http://localhost:3000');
        }
      }, 500);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (mascotWindow) mascotWindow.close();
  });
}

function createMascotWindow() {
  if (mascotWindow) {
    mascotWindow.focus();
    return;
  }

  // Calculate bottom right corner positioning based on primary display metrics
  let x = undefined;
  let y = undefined;
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const windowWidth = 300;
    const windowHeight = 420;
    x = screenWidth - windowWidth - 20; // 20px from right edge
    y = screenHeight - windowHeight - 30; // 30px from bottom taskbar
  } catch (err) {
    console.error("Failed to calculate screen position:", err);
  }

  mascotWindow = new BrowserWindow({
    width: 300,
    height: 420,
    x: x,
    y: y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mascotWindow.loadURL('http://localhost:3000/?view=mascot-only');

  // Retry on connection/load failure (e.g. if express is still starting up)
  mascotWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL.startsWith('http://localhost:3000')) {
      setTimeout(() => {
        if (mascotWindow) {
          mascotWindow.loadURL('http://localhost:3000/?view=mascot-only');
        }
      }, 500);
    }
  });

  mascotWindow.on('closed', () => {
    mascotWindow = null;
  });
}

function createTray() {
  try {
    // Try to load icon.png first, fallback to icon.svg
    let iconPath = path.join(__dirname, 'public', 'icon.png');
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Kurumsal İş Asistanı', enabled: false },
      { type: 'separator' },
      { label: 'Ana Paneli Aç', click: () => { if (mainWindow) mainWindow.show(); else createMainWindow(); } },
      { label: 'Asistan Robotu Masaüstüne Çıkar', click: () => { createMascotWindow(); } },
      { type: 'separator' },
      { label: 'Çıkış', click: () => {
        app.isQuitting = true;
        app.quit();
      }}
    ]);

    tray.setToolTip('Kurumsal İş Asistanı');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
      if (mainWindow) mainWindow.show();
      else createMainWindow();
    });
  } catch (error) {
    console.error('Failed to create tray icon:', error);
    // Silent fail for tray creation so the main application window can still load and run perfectly!
  }
}

// Electron application lifecycle hooks
app.whenReady().then(() => {
  // Start express backend first
  startExpressServer();

  // Wait a bit for server to spin up
  setTimeout(() => {
    createMainWindow();
    createTray();
  }, 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // express server terminates automatically with the main process
});

// IPC communication channel
ipcMain.on('open-mascot-widget', () => {
  createMascotWindow();
});

ipcMain.on('resize-mascot-window', (event, { width, height }) => {
  if (mascotWindow) {
    try {
      const bounds = mascotWindow.getBounds();
      // Calculate new x, y to anchor to bottom right corner of its previous state
      const newX = bounds.x + bounds.width - width;
      const newY = bounds.y + bounds.height - height;
      mascotWindow.setBounds({
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(width),
        height: Math.round(height)
      });
    } catch (err) {
      console.error('Failed to set bounds on mascot window:', err);
    }
  }
});

ipcMain.on('drag-mascot-window', (event, { dx, dy }) => {
  if (mascotWindow) {
    try {
      const [x, y] = mascotWindow.getPosition();
      mascotWindow.setPosition(Math.round(x + dx), Math.round(y + dy));
    } catch (err) {
      console.error('Failed to drag mascot window:', err);
    }
  }
});

ipcMain.on('walk-mascot-window', (event, { dx, dy }) => {
  if (mascotWindow) {
    try {
      const [x, y] = mascotWindow.getPosition();
      const bounds = mascotWindow.getBounds();
      const { screen } = require('electron');
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

      let newX = x + dx;
      let newY = y + dy;

      // Bound checking: prevent walking off the screen completely
      if (newX < 10) newX = 10;
      if (newX > screenWidth - bounds.width - 10) newX = screenWidth - bounds.width - 10;
      if (newY < 10) newY = 10;
      if (newY > screenHeight - bounds.height - 10) newY = screenHeight - bounds.height - 10;

      mascotWindow.setPosition(Math.round(newX), Math.round(newY));
    } catch (err) {
      console.error('Failed to walk mascot window:', err);
    }
  }
});

const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let mascotWindow;
let tray;
let expressProcess;

function startExpressServer() {
  // Spawn the express server in production built mode
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  
  // Set production environment
  const env = { ...process.env, NODE_ENV: 'production', PORT: '3000' };
  
  expressProcess = spawn('node', [serverPath], { env });
  
  expressProcess.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
  });

  expressProcess.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });
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

  // Load local express server or falling back to built assets
  mainWindow.loadURL('http://localhost:3000');

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

  mascotWindow = new BrowserWindow({
    width: 280,
    height: 380,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mascotWindow.loadURL('http://localhost:3000/?view=mascot-only');

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
    if (expressProcess) expressProcess.kill();
    app.quit();
  }
});

app.on('will-quit', () => {
  if (expressProcess) expressProcess.kill();
});

// IPC communication channel
ipcMain.on('open-mascot-widget', () => {
  createMascotWindow();
});

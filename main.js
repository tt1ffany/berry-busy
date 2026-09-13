const path = require('path');

try {
  require('electron-reload')(__dirname, {
    electron: process.execPath
  });
} catch (err) {
  console.log('Skipping electron-reload');
}

const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 320,
        height: 320,
        resizable: false,
        alwaysOnTop: false,
        frame: false,
        transparent: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow(); 
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
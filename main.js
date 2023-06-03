const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { join } = require('path');
const { existsSync } = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  // Handle pendrive insertion event
  ipcMain.on('pendrive-inserted', (event, pendriveKey) => {
    const laptopKey = 'YOUR_LAPTOP_KEY'; // Replace with your laptop key

    if (pendriveKey === laptopKey) {
      event.reply('key-matched');
    } else {
      event.reply('key-mismatched');
    }
  });

  // Open dialog to select files
  ipcMain.on('open-files-dialog', async (event) => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });

    event.reply('selected-files', filePaths);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
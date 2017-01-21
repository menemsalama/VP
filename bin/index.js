const fs = require('fs');
const path = require('path');
const {
  app, BrowserWindow
} = require('electron');
const {
  openFile, openUrl, createWindow
} = require('../src/');

let win;

app.on('open-file', openFile);

app.on('open-url', openUrl);

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const packageJson = require('./package.json');
const appVerion = `-${packageJson["version"]} ${packageJson["versionStatus"] === "beta" && packageJson["versionStatus"] || ""}`;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 500,
    minWidth: 800, minHeight: 500,
    frame: false, title: `VP${appVerion}`,
    icon: 'icon.ico',
    backgroundColor: '#000', hasShadow: false,
  });

  win.loadURL(`file://${__dirname}/index.html`);
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

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



// NOTE: to pass values in app logic
// global.sharedObject = {prop1: process.argv}
// NOTE: to recieve it in UI logic
// var remote = require('electron').remote,
//   arguments = remote.getGlobal('sharedObject').prop1;

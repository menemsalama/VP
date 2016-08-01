const electron = require('electron');
const {app, BrowserWindow} = electron;

// const {ipcMain} = require('electron');
// const {dialog} = require('electron')
const {openFile, openUrl} = require('./src/index');

const appPkg = require('./package.json');
const appVerion = `-${appPkg["version"]} ${appPkg["versionStatus"] === "beta" && appPkg["versionStatus"] || ""}`;

let win;

function createWindow() {
  win = new BrowserWindow({
    title: 'VP', width: 700, height: 440,
    minWidth: 700, minHeight: 440,
    frame: false, title: `VP${appVerion}`,
    icon: `${__dirname}/icon.ico`,
    backgroundColor: '#000', hasShadow: false,
  });

  win.setThumbarButtons([
    {
      tooltip: 'previous',
      icon: `${__dirname}/thumbarIcons/video_previous.png`,
      click() { thumbarButtons('previous') }
    },
    {
      tooltip: 'stop',
      icon: `${__dirname}/thumbarIcons/video_stop.png`,
      flags: ['dismissonclick'],
      click() { thumbarButtons('stop') }
    },
    {
      tooltip: 'forward',
      icon: `${__dirname}/thumbarIcons/video_forward.png`,
      click() { thumbarButtons('forward') }
    }
  ]);

  win.loadURL(`file://${__dirname}/views/pages/index.html`);
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}


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



// NOTE: to pass values in app logic
// global.sharedObject = {prop1: process.argv}
// NOTE: to recieve it in UI logic
// var remote = require('electron').remote,
//   arguments = remote.getGlobal('sharedObject').prop1;

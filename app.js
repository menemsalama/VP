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
    title: 'VP', width: 710, height: 440,
    minWidth: 700, minHeight: 440,
    frame: false, title: `VP${appVerion}`,
    icon: `${__dirname}/icons/icon.ico`,
    backgroundColor: '#000', hasShadow: false,
  });

  // TODO: add thumbarButtons functions
  // win.setThumbarButtons([
  //   {
  //     tooltip: 'previous',
  //     icon: `${__dirname}/thumbarIcons/video_previous.png`,
  //     click() { thumbarButtons('previous') }
  //   },
  //   {
  //     tooltip: 'stop',
  //     icon: `${__dirname}/thumbarIcons/video_stop.png`,
  //     flags: ['dismissonclick'],
  //     click() { thumbarButtons('stop') }
  //   },
  //   {
  //     tooltip: 'forward',
  //     icon: `${__dirname}/thumbarIcons/video_forward.png`,
  //     click() { thumbarButtons('forward') }
  //   }
  // ]);

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



// TODO: build windows installer
// TODO: create a desktop shortcut for VP, add it to windows contextmenu to open directory and videos

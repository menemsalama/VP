const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
// const {ipcMain} = require('electron');
// const {dialog} = require('electron')

const appPkg = require('./package.json');
const appVerion = `-${appPkg["version"]} ${appPkg["versionStatus"] === "beta" && appPkg["versionStatus"] || ""}`;

let win;
// NOTE: fire this if user open file with VP
let openFile = (e, path) => {
  // e.preventDefault();
  // TODO: send file path
};
// NOTE: fire this if user opend directory with VP
let createPlayList = (e, url) => {
  // e.preventDefault();
  // TODO: send dir url
};
// NOTE: [previous | Stop | next] video
let thumbarButtons = (action) => {
  // TODO: send action to Render process to handle it
  console.log(action);
};

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 500,
    minWidth: 800, minHeight: 500,
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

  win.loadURL(`file://${__dirname}/index.html`);
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}


app.on('open-file', openFile);

app.on('open-url', createPlayList);

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

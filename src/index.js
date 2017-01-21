const {BrowserWindow}   = require('electron');
const path              = require('path');

let rootPath = path.join(__dirname, "../");
let appPkg = require(`${rootPath}/package.json`);
let appVerion = `-${appPkg.version} ${appPkg.versionStatus === "beta" && appPkg.versionStatus || ""}`;

exports.openFile = (e) => {
  e.preventDefault();
  alert("open file");
};

exports.openUrl = (e) => {
  e.preventDefault();
  alert("open dir");
};

exports.createWindow = () => {

  let indexPage = path.join(__dirname, '..', 'views/index.html'); //'file://'

  win = new BrowserWindow({
    title: `VP ${appVerion}`, width: 710, height: 440,
    minWidth: 710, minHeight: 440, transparent: true,
    frame: false, icon: `${rootPath}/public/icons/icon.ico`,
    backgroundColor: '#000', hasShadow: false
  });

  win.loadURL(indexPage);

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

};

// function createWindow() {
//   // win.setThumbarButtons([
//   //   {
//   //     tooltip: 'previous',
//   //     icon: `${__dirname}/thumbarIcons/video_previous.png`,
//   //     click() { thumbarButtons('previous') }
//   //   },
//   //   {
//   //     tooltip: 'stop',
//   //     icon: `${__dirname}/thumbarIcons/video_stop.png`,
//   //     flags: ['dismissonclick'],
//   //     click() { thumbarButtons('stop') }
//   //   },
//   //   {
//   //     tooltip: 'forward',
//   //     icon: `${__dirname}/thumbarIcons/video_forward.png`,
//   //     click() { thumbarButtons('forward') }
//   //   }
//   // ]);
// }

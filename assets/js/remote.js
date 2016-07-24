const { remote } = require('electron');
let wind = {};
wind.toggle = () => {
  if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
    remote.BrowserWindow.getFocusedWindow().unmaximize();
  } else {
    remote.BrowserWindow.getFocusedWindow().maximize();
  }
};


wind.close = () => {
  remote.BrowserWindow.getFocusedWindow().close();
};


wind.minimize = () => {
  remote.BrowserWindow.getFocusedWindow().minimize()
}

wind.toggleScreen = () => {
  if (document.webkitIsFullScreen) {
    document.webkitCancelFullScreen();
  } else {
    document.getElementById('player').webkitRequestFullScreen();
  }
}

const { remote } = require('electron');
// const {ipcRenderer} = require('electron');
let wind = {};
// win.setProgressBar(0.5);

wind.toggle = () => {
  if (remote.BrowserWindow.getFocusedWindow().isMaximized()) return remote.BrowserWindow.getFocusedWindow().unmaximize();
  return remote.BrowserWindow.getFocusedWindow().maximize();
};


wind.close = () => {
  remote.BrowserWindow.getFocusedWindow().close();
};


wind.minimize = () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
}

wind.toggleScreen = () => {
  if (document.webkitIsFullScreen) {
    $('#bottom .expand.icon').addClass("exband").removeClass("compress");
    return document.webkitCancelFullScreen();
  }
  new Notification("Exit from fullscreen mode");
  $('#bottom .expand.icon').removeClass("exband").addClass("compress");
  return document.getElementById('player').webkitRequestFullScreen();
}

wind.onTopToggle = (el) => {
  if ($(el).find('i').hasClass('empty')) {
    new Notification("OnTop mode is on");
    remote.getCurrentWindow().setAlwaysOnTop(true);
    return $(el).find('i').removeClass('empty');
  }
  new Notification("OnTop mode is off");
  remote.getCurrentWindow().setAlwaysOnTop(false);
  return $(el).find('i').addClass('empty');
};

wind.progressBar = (param) => {
  // available values [-1, 0 to 1]
  remote.getCurrentWindow().setProgressBar(param);
};
wind.progressBar(-1)

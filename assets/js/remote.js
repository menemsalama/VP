const { remote } = require('electron');
let wind = {};

wind.toggle = () => {
  if (remote.BrowserWindow.getFocusedWindow().isMaximized()) return remote.BrowserWindow.getFocusedWindow().unmaximize();
  remote.BrowserWindow.getFocusedWindow().maximize();
};


wind.close = () => {
  remote.BrowserWindow.getFocusedWindow().close();
};


wind.minimize = () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
}

wind.toggleScreen = () => {
  if (document.webkitIsFullScreen) {
    console.log("full screen");
    $('#bottom .expand.icon').addClass("exband").removeClass("compress");
    return document.webkitCancelFullScreen();
  }
  $('#bottom .expand.icon').removeClass("exband").addClass("compress");
  document.getElementById('player').webkitRequestFullScreen();
}

wind.onTopToggle = (el) => {
  if ($(el).find('i').hasClass('empty')) {
    remote.getCurrentWindow().setAlwaysOnTop(true);
    return $(el).find('i').removeClass('empty');
  }
  remote.getCurrentWindow().setAlwaysOnTop(false);
  return $(el).find('i').addClass('empty');
};

/*

All keyboard events will be fired here

*/

let keys = { alt: false, enter: false };

$(document).keydown(function(event) {

  if (event.keyCode === 18) keys["alt"] = true;
  else if (event.keyCode === 13 && keys["alt"] === true) keys["enter"] = true;
  if (keys["alt"] && keys["enter"]) {
    keys["alt"] = false;
    keys["enter"] = false;
    wind.toggleScreen();
  }
  // NOTE: To cancel the event if the user didn't hit Enter directly
  setTimeout(function () {
    keys["alt"] = false;
  }, 300)

  // NOTE: time control
  if (event.keyCode === 39) { // Step Forward
    videoForwardPrevious(1);
  } else if (event.keyCode === 37) { // Step Previous
    videoForwardPrevious(0);
  }


  // NOTE: volume control
  if (event.keyCode === 38) {
    volumeController(1);
  }
  else if (event.keyCode === 40) {
    volumeController(0);
  };

  // toggle play
  if (event.keyCode === 32) return togglePlayVideo();

  if (event.keyCode === 27) {
    setTimeout(() => {
      if (!document.webkitIsFullScreen) {
        $('#bottom .expand.icon').addClass("exband").removeClass("compress");
      }
    }, 250);
  }


  // TODO: controll OS volume on press ctrl && up || ctrl && down arrow
  // TODO: and show progress-bar for it
});

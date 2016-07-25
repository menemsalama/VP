let keys = { alt: false, enter: false };


let volumeController = (param) => {
  if (param) {
    if (video.volume !== 1) {
      video.volume += .1;
      $("#volume-container").show();
      $("#volume-progress").css("height", video.volume * 100);
    }
  } else {
    if (video.volume > .1) {
      video.volume -= .1;
      $("#volume-container").show();
      $("#volume-progress").css("height", video.volume * 100);
    }
  }

  let oldVolume = video.volume;
  setTimeout(function () {
    let newVolume = video.volume;
    if (oldVolume === newVolume) {
      setTimeout(function () {
        if (oldVolume === video.volume && newVolume === oldVolume) {
          $("#volume-container").hide(100);
        }
      }, 606);
    }
  }, 606);

};

let videoForwardPrevious = (param) => {
  if (video.src.length > 0) {
    if (param) video.currentTime+=4;
    else video.currentTime-=4;

    $("#video-container #currentTime").text(toHHMMSS(video.currentTime));
    $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  }
};

// All keyboards event will be fired here
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
  if (event.keyCode === 32) {
    if (video.paused) video.play();
    else video.pause();
  }

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

// NOTE: I don't know how wrote this???
// $(document.body).keyup(function(event) {
//   // reset status of the button 'released' == 'false'
//   if (event.keyCode == 16) {
//     keys["shift"] = false;
//   } else if (event.keyCode == 17) {
//     keys["ctrl"] = false;
//   }
// });


$(document).on("mousewheel", (e) => {
  if(e.originalEvent.wheelDelta /120 > 0) {
    volumeController(1);
  }
  else{
    volumeController(0);
  }
})

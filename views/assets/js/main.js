/*

mostly functions, variables declaration

*/

const fs = require('fs');
const supportedTypes = ['mp4', 'm4v', 'm4a', 'mp3', 'ogv', 'ogm', 'ogg', 'oga', 'webm', 'wav', 'mkv'];

// NOTE: basic variables will be used below
let video = document.getElementById('player');
let playList = [], currentVideo;

// NOTE: To store video setInterval function
let videoInterval;

// NOTE: defining basic functions

// to show loader on the page
let loading = function (param) {
  if (param) return $(".pusher").addClass("ui loading form");
  return $(".pusher").removeClass("ui loading form");
};

// To emit notifications for user
let Notification = function (message) { // to show notification to user
  this.message = message;
  (this.show = () => {
    $("#notifications-container").show(300);
    $("#notifications-container #caption").text(this.message);
    setTimeout(function() {
      $("#notifications-container").hide(300);
    }, 2e3);
  })();
};

let ERR = function(header, message) { // handling app possible errors
  // NOTE: to display the error on the user using semantic ui modal
  // VP can't open the file
  // VP tried to open the file but it seems the file is not listed as a valid
  this.header = header || "error";
  this.message = message;
  (this.showToUser = () => {
    $("#errorModal .ui.header, #errorModal .description p").text("");
    $("#errorModal .header").text(this.header);
    $("#errorModal .description p").text(this.message);
    $("#errorModal").modal("show");
  })();
  // console.log(this.header, this.message);
};

// NOTE: unnecessary function to check if the target is directory or just files
let isAdirOrFiles = (inputTag) => {
  let files = $(inputTag).get(0).files;
  if (files.length > 1) return "files";
  for (var i = 0; i < files.length; i++) {
    if (files[i].type.length > 5) return "files";
  }
  if (typeof files[0].webkitRelativePath === "string" || inputTag.value.slice(0, 10) === "C:akepath") return "directory";
  return "files";
};


// NOTE: to get files from dir
let VideosDir = function(func) {
  // <input id="openDir" type="file" webkitdirectory directory multiple/>
  this.cb = (callback, err, param) => {
    return callback(err, param);
  };
  this.input = Object.assign(document.createElement('input'), {
    type: 'file',
    webkitdirectory: true,
    multiple: true
  });
  this.input.click();
  this.input.addEventListener('change', () => {
    return this.cb(func, null, this.input);
  });
};

// NOTE: to pick up videos using input tag
let Videos = function (cbFunc) {
  this.cb = (callback, err, param) => {
    return callback(err, param);
  };
  this.input = Object.assign(document.createElement('input'), {
    type: 'file',
    id: 'file',
    multiple: true,
    accept: ".mkv,video/mp4,video/x-m4v,video/*"
  });
  this.input.click();
  this.input.addEventListener('change', () => {
    return this.cb(cbFunc, null, this.input.files);
  });
};

// NOTE: to play video and update progress bar
let Video = function () {
  clearInterval(videoInterval);
  this.cb = (callback, param) => {
    return callback(param);
  };
  // start video when it possible
  this.play = (index, callback) => {

    currentVideo = Number(index);
    if (playList[currentVideo]) {
      video.src = playList[currentVideo].path;
      let item = $("#sidebar .item").removeClass("playing");
      $(item[currentVideo]).addClass("playing");
      $("#video-play-pause .play").removeClass("play").addClass("pause");
      // $("#media-name").text(`${playList[currentVideo].name.substring(0, 37)}...`);
      $("#media-name").text(`${playList[currentVideo].name}...`);
      return this.cb(callback, currentVideo);
    } else {

      if (typeof playList[0] === "undefined") return new Notification('the file you tried to add is not valid or may his type Not supported');

      if (typeof playList[0] !== "undefined" && typeof playList[currentVideo] === "undefined") {
        this.stop();
        return new Notification("No more videos to play");
      }
    }
  };

  this.stop = () => {
    video.pause();
    this.stopTracking();
    wind.progressBar(-1);
    video.currentTime = 0;
    document.webkitCancelFullScreen();
    $("#progress-bar").css("width", "0%");
    $("#video-play-pause #vpp").removeClass("pause").addClass("play");
    $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
  };

  // start tracking video progress and stop when video end
  this.trackProgress = () => {
    videoInterval = setInterval(() => {
      if (video.readyState === 4 ) {
        $("#video-container #duration").text(video.duration.toHHMMSS());
        $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
        $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
        wind.progressBar(parseFloat(parseInt(video.currentTime / video.duration * 100)) / 100.0);
      }

      if (video.ended) {
        wind.progressBar(-1);
        clearInterval(videoInterval);
        this.playNext();
      }

      // console.log("video is in progress");
    }, 2e2);
  };
  this.stopTracking = () => {
    clearInterval(videoInterval);
  };
  // NOTE: autoplay
  this.playNext = () => {
    this.play(++currentVideo, (currentVideo) => {
      clearInterval(videoInterval);
      video.play();
      this.trackProgress();
    })
  };
};

// BUG: Some url's not working
// NOTE: The video works after change his name
// TODO: Relay on main process script and readStream module
let openVideos = function () {
  new Videos(function (err, videos) {
    if (err) console.log(err);
    new PlayList().cleanup();

    new PlayList().add(videos, function (errs, playList) {
      new Video().play(0, function (currentVideo) {
        let tmp = setInterval(function () {
          if (video.readyState === 4) {
            video.play();
            // window.resizeTo(video.videoWidth - (video.videoWidth / 8), video.videoHeight - (video.videoHeight / 15));
            clearInterval(tmp);
          }
        }, 50);

        new Video().trackProgress();
        return currentVideo;
      });
    });

  });
};

// NOTE: to controll play list [add, clean, cleanup]
let PlayList = function() {

  this.cb = (callback, err, param) => {
    return callback(err, param);
  };

  this.add = (videos, callback) => {
    let errs = [];
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].type.slice(0, 5) === "video" || supportedTypes.indexOf(videos[i].name.split('.')[1].toLowerCase()) !== -1) {
        playList.push(videos[i]);
        // $("#sidebar").append(`<a class="item" data-video-path="${videos[i].path}" data-video-index="${playList.length-1}"> ${videos[i]['name']} </a>`);

        $("#sidebar").append(`<div class="item" data-video-path="${videos[i].path}" data-video-index="${playList.length-1}"> <a class="play">${videos[i]['name']}</a> <a class="trash"> <i class="trash icon"></i> </a> </div>`);

      } else {
        errs.push({type: 'error', message: 'file type is not supported', file: videos[i]});
      }
    }
    return this.cb(callback, errs, playList);
  };

  // NOTE: To remove one video from the playList array
  this.clean = (video, callback) => {
    if (typeof video === "number") {
      playList.splice(video, 1);
      return this.cb(callback, null, "success");
    }

    return this.cb(callback, "clean function expect a parameter to be a Number", null);
  };

  // NOTE: To cleanup all the play list
  this.cleanup = () => {
    $("#media-name, #sidebar").empty();
    $("#video-play-pause #vpp").removeClass("pause").addClass("play");
    $("#video-container #duration, #video-container #currentTime").text("0:00:00");
    $("#progress-bar").css("width", "0%");
    $(video).attr("src", "").removeAttr("src")
    wind.progressBar(-1);
    return playList = [];
  };
};


let togglePlayVideo = function (action) {
  let elm = $("#video-play-pause .play, #video-play-pause .pause");

  if (video.src.length === 0 && typeof playList[0] === "undefined") {
    openVideos();
    return false;
  }

  if (action === "play" && video.readyState === 4) {
    $(elm).removeClass("play").addClass("pause");
    new Video().trackProgress();
    return video.play();
  }

  if (action === "pause" && video.readyState === 4) {
    $(elm).removeClass("pause").addClass("play");
    new Video().stopTracking();
    return video.pause();
  }


  if ($(elm).hasClass("play") && video.src.length > 0) {
    $(elm).removeClass("play").addClass("pause");
    new Video().trackProgress();
    return video.play();
  } else if ($(elm).hasClass("pause") && video.src.length > 0) {
    new Video().stopTracking();
    $(elm).removeClass("pause").addClass("play");
    return video.pause();
  }

};

Number.prototype.toHHMMSS = function () {
  let sec_num = parseInt(this, 10),
  hours   = Math.floor(sec_num / 3600),
  minutes = Math.floor((sec_num - (hours * 3600)) / 60),
  seconds = sec_num - (hours * 3600) - (minutes * 60);

  // if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    setTimeout(function() {
      return hours+':'+minutes+':'+seconds;
    }, 100);
  } else {
    return hours+':'+minutes+':'+seconds;
  }
}

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

    $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
    $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  }
};


$('.ui.dropdown').dropdown();
$('.inDevelopment').hide();

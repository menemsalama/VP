/*

mostly functions, variables declaration

*/

const fs = require('fs');
const supportedTypes = ['mp4', 'm4v', 'm4a', 'mp3', 'ogv', 'ogm', 'ogg', 'oga', 'webm', 'wav', 'mkv'];

// NOTE: basic variables will be used below
let video = document.getElementById('player');
let playList = [], currentVideo;

// NOTE: defining basic functions
let loading = function (param) {
  if (param) return $(".pusher").addClass("ui loading form");
  return $(".pusher").removeClass("ui loading form");
};

let Notification = function (message) { // to show notification to user
  this.message = message;
  this.show = () => {
    $("#notifications-container").show(300);
    $("#notifications-container #caption").text(this.message);
    setTimeout(function() {
      $("#notifications-container").hide(300);
    }, 2000);
  };
  this.show();
};

let ERR = function(header, message) { // handling app possible errors
  // NOTE: to display the error on the user using semantic ui modal
  // VP can't open the file
  // VP tried to open the file but it seems the file is not listed as a valid
  this.header = header || "error";
  this.message = message;
  (this.showToUser = () => {
    $("#errorModal .ui.header, #errorModal .description p").text("");
    $("#errorModal .ui.header").text(this.header);
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

let scanFile = (file) => {
  // TODO: to check file type and if missing try to
  // TODO: create video tag and try the file if work play it
  // TODO: if not throw error "file type is not supported"
  // TODO: return obj with status vaild or invalid if valid push it to playList array
};




// NOTE: video player functions

// NOTE: to get videos directory path [Not working yet]
let VideosDir = function(func) {
  // NOTE: to get files from dir
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
    // let input = this.input
    // if (input) return this.dirPath = input.files[0].path;
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
  this.cb = (callback, param) => {
    return callback(param);
  };
  // start video when it possible
  this.play = (index, callback) => {

    currentVideo = index;
    if (playList[currentVideo]) {
      video.src = playList[currentVideo].path;
      let item = $("#sidebar .item").removeClass("playing");
      $(item[currentVideo]).addClass("playing");
      $("#video-play-pause .play").removeClass("play").addClass("pause");
      $("#media-name").text(`${playList[currentVideo].name.substring(0, 37)}...`);
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
    let tempInterval = setInterval(function() {
      if (video.readyState === 4) {
        $("#video-container #duration").text(video.duration.toHHMMSS());
        clearInterval(tempInterval);
      }
    }, 100);
    this.videoProgress = setInterval(() => {
      if (video.readyState === 4 && !video.paused) {
        let percent = parseInt(video.currentTime / video.duration * 100),
        decimal = parseFloat(percent) / 100.0;
        $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
        $("#progress-bar").css("width", percent + "%");
        wind.progressBar(decimal);
      }
      if (video.ended) {
        wind.progressBar(-1);
        this.stopTracking();
        this.playNext();
      }
    }, 30);
  };

  // TODO: fix bug
  // NOTE: clearInterval not stopping videoProgress Interval
  this.stopTracking = () => {
    // var highestTimeoutId = setTimeout(";");
    // for (var i = 0 ; i < highestTimeoutId ; i++) {
    //   clearTimeout(i);
    // }
    clearInterval(this.videoProgress);
  };
  // NOTE: autoplay
  this.playNext = () => {
    this.play(++currentVideo, (currentVideo) => {
      video.play();
      this.trackProgress();
    })
  };
};

let openVideos = function () {
  // loading(1);
  new Videos(function (err, videos) {
    if (err) console.log(err);
    new PlayList().cleanup();

    new PlayList().add(videos, function (errs, playList) {
      // console.log(errs);
      new Video().play(0, function (currentVideo) {
        // loading(0);
        video.play();
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
  // return this.cb(cbFunc, null, this.input.files);

  this.add = (videos, callback) => {
    let errs = [];
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].type.slice(0, 5) === "video" || supportedTypes.indexOf(videos[i].name.split('.')[1].toLowerCase()) !== -1) {
        playList.push(videos[i]);
        $("#sidebar").append(`<a class="item" data-video-path="${videos[i].path}" data-video-index="${playList.length-1}"> ${videos[i]['name']} </a>`);
      } else {
        errs.push({type: 'error', message: 'file type is not supported', file: videos[i]});
      }
    }
    return this.cb(callback, errs, playList);
  };
  // NOTE: to remove one or array of vieos
  this.clean = (videos, callback) => {
    if (typeof videos === "number") {

      return this.cb(callback, null, "It's a array");
    }
    // return "clean function expect first parameter to be Array";
    return this.cb(callback, "clean function expect first parameter to be Array", null);
  };
  // NOTE: to cleanup all the play list
  this.cleanup = () => {

    $("#sidebar").html("");
    $("#media-name").text("");
    $("#video-play-pause #vpp").removeClass("pause").addClass("play");
    $("#video-container #duration").text("0:00:00");
    $("#video-container #currentTime").text("0:00:00");
    $("#progress-bar").css("width", "0%");
    wind.progressBar(-1);
    return playList = [], $(video).attr("src", ""), $(video).removeAttr("src");
  };
};


// let nextInPlayList = () => {
//   // TODO: play cext video in the play list when cuurent end
//   // TODO: find next and invoke it with playVideo(obj)
// };



let togglePlayVideo = function (action) {
  let elm = $("#video-play-pause .play, #video-play-pause .pause");

  if (video.src.length === 0 && typeof playList[0] === "undefined") {
    openVideos();
    // $(video).attr('src', "");
    // new Notification(videoError).show();
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
  // let msg = new Notification('new videos has been Added the playlist');
  // msg.show();
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

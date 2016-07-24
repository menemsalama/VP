let video = document.getElementById('player');
let playList = [];

let toHHMMSS = function (param) {
  var sec_num = parseInt(param, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  // if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

// NOTE: Play the video when it is available
let playIt = () => {
  let interval = setInterval(function() {
    if (video.readyState === 4) {
      $("html").removeClass("ui loading form");
      // width then height
      window.resizeTo(video.videoWidth - 200, video.videoHeight - 100);
      videoPlay()
      $("#video-container #duration").text(toHHMMSS(video.duration));
      clearInterval(interval);
    }
  }, 777);
}

let addToPlayList = function (files) {
  $("html").addClass("ui loading form");
  playList = [];
  $("#sidebar").html('');
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.type.slice(0, 5) === "video") {
      playList.push(file);
      $("#sidebar").append(`<a class="item" data-file-path="${file.path}" onclick="play()"> ${file.name} </a>`);
    }
  }
  video.src = playList[0].path;
  $("#topNav .brand").text(playList[0].name);
  playIt();
};


let play = () => {
  let v = event.currentTarget, path = $(v).attr('data-file-path'), name = $(v).text();
  video.src = path;
  $("#topNav .brand").text(name);
  $('#sidebar').sidebar('toggle');
  playIt();
};

document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  let files = event.dataTransfer.files;
  if (files.length > 0) {
    addToPlayList(files);
  }
});
// NOTE: to prevent app from re/loading file
document.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
// NOTE: It was a solution from stackoverflow didn't work for me!
// webview.addEventListener('dragover', function(e) {
//   e.preventDefault();
// });

// to open video from the playList
let openVideo = function () {
  let input = document.getElementById('files');
  input.click();
  $("#files").on('change', function(e) {
    let files = $(input).get(0).files;
    if (files.length > 0) {
      addToPlayList(files);
    }
  });
};



document.addEventListener('contextmenu', function(e) {
  $('#sidebar').sidebar('toggle');
});
let videoCurrentTime;
let togglePlay = () => {
  let elm = $("#video-play-pause .play, #video-play-pause .pause");
  if ($(elm).hasClass("play") && video.src.length > 0) {
    $(elm).removeClass("play").addClass("pause");
    video.play();
    videoCurrentTime = setInterval(function() {
      if (video.readyState === 4) {
        $("#video-container #currentTime").text(toHHMMSS(video.currentTime));
        $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
      }
      if (video.ended) {
        videoStop();
      }
    }, 30);
  } else {
    if (!video.src.length > 0) {
      openVideo();
    }
    $(elm).removeClass("pause").addClass("play");
    video.pause();
    clearInterval(videoCurrentTime);
  }
};

let videoPlay = () => {
  let elm = $("#video-play-pause .play, #video-play-pause .pause");
  if ($(elm).hasClass("play") && video.src.length > 0) {
    $(elm).removeClass("play").addClass("pause");
    videoCurrentTime = setInterval(function() {
      if (video.readyState === 4) {
        video.play();
        $("#video-container #currentTime").text(toHHMMSS(video.currentTime));
        $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
      }
      if (video.ended) {
        videoStop();
      }
    }, 30);
  }
};

let videoStop = () => {
  video.pause();
  video.currentTime = 0;
  let elm = $("#video-play-pause .play, #video-play-pause .pause");
  $(elm).removeClass("pause").addClass("play");
  $("#video-container #currentTime").text(toHHMMSS(video.currentTime));
  $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  document.webkitCancelFullScreen();
  clearInterval(videoCurrentTime);
};

$("#video-container").on("click", "#video-play-pause", togglePlay);

// To show video controllers on mouse move
let mouseArray = [];
$(document).on("mousemove", () => {
  let show = true, oldX = event.pageX;
  mouseArray.push(oldX);
  $("#bottom").css("display", "block");
  setTimeout(function () {
    show = false;
    setTimeout(function() {
      if (!show && oldX === mouseArray[mouseArray.length-1]) {
        $("#bottom").css("display", "none");
      }
    }, 800);
  }, 800);
});


$("#video-container #progress-container").on('click', function (e) {
  if (video.readyState === 4) {
    let container = this.parentElement,
    mouseX = e.pageX - container.offsetLeft,
    containerWidth = window.getComputedStyle(this).getPropertyValue('width');
    containerWidth = containerWidth.substr(0, containerWidth.length - 2)
    let precent = parseInt((mouseX / containerWidth) * 100);
    video.currentTime = (mouseX/containerWidth)*video.duration;
    $("#video-container #currentTime").text(toHHMMSS(video.currentTime));
    $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  }
});


$('.ui.dropdown').dropdown();

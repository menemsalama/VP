/*
All app events like [click, drag, drop, mousemove] goes here
*/
document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  $('#sidebar').sidebar('hide');

  let files = event.dataTransfer.files;
  if (files.length > 0) {
    new PlayList().cleanup();
    new PlayList().add(files, function (errs, playList) {
      new Video().play(0, function (errs, playlist) {
        video.play();
        new Video().trackProgress();
        return currentVideo;
      });
    });
  }
});
// NOTE: To prevent app reloading
document.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
// NOTE: It was a part of solution from stackoverflow
// webview.addEventListener('dragover', function(e) {
//   e.preventDefault();
// });

document.addEventListener('contextmenu', function(e) {
  $('#sidebar').sidebar('toggle');
});

$(document).on("mousewheel", (e) => {
  if(e.originalEvent.wheelDelta /120 > 0) volumeController(1);
  else volumeController(0);
})

document.getElementById('sidebar').addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  let files = event.dataTransfer.files;
  if (files.length > 0) {
    new PlayList().add(files, (errs, playlist) => {
      $('#sidebar').sidebar('hide');

      if (typeof errs[0] !== "undefined" && typeof playlist[0] === "undefined") {
        new Notification('the file you tried to add is not valid or may his type Not supported');
      }

      if (typeof playlist[0] !== "undefined") {
        new Notification('new videos has been Added the playlist');
      }

    });
  }
});

$("#sidebar").on('click', '.item', function (e) {
  e.stopPropagation();
  $('#sidebar').sidebar('hide');
  let index = $(e.currentTarget).attr('data-video-index');
  new Video().play(index, () => {
    video.play();
    new Video().trackProgress();
  });
});


$("#openDirVideos").on('click', function (e) {
  new VideosDir(function (err, inputTag) {
    console.log(inputTag.files[0].path);

    fs.readdir(inputTag.files[0].path, 'utf8', (err, data) => {
      if (err) console.log(err);

      let videos = []
      data.forEach(function (path) {
        let ext = path.split('.')[1];
        if (ext && supportedTypes.indexOf(ext.toLowerCase()) !== -1) {
          let obj = {
            'name': path, 'path': `${inputTag.files[0].path}\\${path}`,
            type: `video\\${ext}`
          };
          videos.push(obj);
        }
      });

      new PlayList().cleanup();

      new PlayList().add(videos, function (errs, playList) {
        // console.log(errs);
        new Video().play(0, function (currentVideo) {
          console.log("valid ", videos);
          // loading(0);
          video.play();
          new Video().trackProgress();
          return currentVideo;
        });
      });

    });

  });
});


$(".inDevelopment").click(() => {
  let el = event.currentTarget;
  new ERR("Not Found", `Sorry, ${el.getAttribute("rel")} section is in development phase.`);
});



$("#video-container").on("click", "#video-play-pause", togglePlayVideo);

// NOTE: it's working fine
// To show video controllers on mouse move
// let mouseArray = [];
// $(document).on("mousemove", () => {
//   let show = true, oldX = event.pageX;
//   mouseArray.push(oldX);
//   $("#bottom-caption").show();
//   setTimeout(function () {
//     show = false;
//     setTimeout(function() {
//       if (!show && oldX === mouseArray[mouseArray.length-1]) {
//         $("#bottom-caption").hide();
//       }
//     }, 800);
//   }, 800);
// });


$("#video-container #progress-container").on('click', function (e) {
  if (video.readyState === 4) {
    let container = this.parentElement,
    mouseX = e.pageX - container.offsetLeft,
    containerWidth = window.getComputedStyle(this).getPropertyValue('width');
    containerWidth = containerWidth.substr(0, containerWidth.length - 2)
    let precent = parseInt((mouseX / containerWidth) * 100);
    video.currentTime = (mouseX/containerWidth)*video.duration;
    $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
    $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  }
});


// // NOTE: Play the video when it is available
// let playIt = () => {
//   let interval = setInterval(function() {
//     if (video.readyState === 4) {
//       $(".pusher").removeClass("ui loading form");
//       // width then height
//       // window.resizeTo(video.videoWidth, video.videoHeight);
//       videoPlay()
//       $("#video-container #duration").text(video.duration.toHHMMSS());
//       clearInterval(interval);
//     }
//   }, 777);
// }
//
// let addToPlayList = function (files) {
//   $(".pusher").addClass("ui loading form");
//   // NOTE: cleanup before adding new videos
//   playList = [];
//   $("#sidebar").html("");
//   $(video).removeAttr('src');
//   videoStop();
//   $("#video-container #duration").text("0:00:00");
//   $("#media-name").text("");
//
//   // looping through files to add videos
//   for (let i = 0; i < files.length; i++) {
//     let file = files[i];
//     if (files[i].type.slice(0, 5) === "video") {
//       playList.push(file);
//       $("#sidebar").append(`<a class="item" data-file-path="${files[i].path}" onclick="play()"> ${files[i].name} </a>`);
//     } else {
//       alert(`can't recognize the file with name:
//       "${files[i].name}"
//       In Path:
//       "${files[i].path}"
//       with type Of:
//       "${files[i].type.length > 5 && files[i].type || 'type is NotFound!!'}"`, "Erorr");
//       $(".pusher").removeClass("ui loading form");
//     }
//   }
//
//   if (playList[0]) {
//     video.src = playList[0].path.toString();
//     $("#media-name").text(`${playList[0].name.substring(0, 37)}...`);
//     playIt();
//   }
// };
//
//
// let play = () => {
//   let v = event.currentTarget, path = $(v).attr('data-file-path'), name = $(v).text();
//   video.src = path;
//   $("#media-name").text(`${name.substring(0, 37)}...`);
//   $('#sidebar').sidebar('toggle');
//   playIt();
// };
//
//
// // to open video from the playList
// let openVideo = function () {
//   let input = Object.assign(document.createElement('input'), {
//     type: 'file',
//     id: 'file',
//     multiple: true,
//     accept: ".mkv,video/mp4,video/x-m4v,video/*"
//   });
//   input.click();
//   input.addEventListener('change', function(e) {
//     let files = $(input).get(0).files;
//     if (files.length > 0) {
//       addToPlayList(files);
//     }
//   });
// };
//
//
//
//
// // let videoPlay = () => {
// //   let elm = $("#video-play-pause .play, #video-play-pause .pause");
// //   if ($(elm).hasClass("play") && video.src.length > 0) {
// //     console.log("videoPlay");
// //     $(elm).removeClass("play").addClass("pause");
// //     videoCurrentTime = setInterval(function() {
// //       if (video.readyState === 4) {
// //         video.play();
// //         $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
// //         $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
// //       }
// //       if (video.ended) {
// //         videoStop();
// //       }
// //     }, 30);
// //   }
// // };
//
// let videoStop = () => {
//   video.pause();
//   video.currentTime = 0;
//   let elm = $("#video-play-pause .play, #video-play-pause .pause");
//   $(elm).removeClass("pause").addClass("play");
//   $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
//   $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
//   document.webkitCancelFullScreen();
//   clearInterval(videoCurrentTime);
// };
//

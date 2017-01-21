/*

All Render process [Front-end logic] events like:
[ drop, dragover, click, mousemove ] -in order-
goes here

*/


window.addEventListener('drop', function(e) {
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
window.addEventListener('dragover', function(e) {
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
  if (!$("#sidebar").hasClass('visible')) {
    if(e.originalEvent.wheelDelta /120 > 0) volumeController(1);
    else volumeController(0);
  }
});

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

$("#sidebar").on('click', '.item .play', function (e) {
  e.stopPropagation();
  $('#sidebar').sidebar('hide');
  let index = $(e.currentTarget.parentElement).attr('data-video-index');
  new Video().play(index, () => {
    video.play();
    new Video().trackProgress();
  });
});

$("#sidebar").on('click', '.item .trash', function (e) {
  e.stopPropagation();
  let index = Number($(e.currentTarget.parentElement.parentElement).attr('data-video-index'));

  new PlayList().clean(index, (err, data) => {
    if (err) console.log(err);
    $($("#sidebar .item")[index]).remove();

    if (currentVideo === index) {
      new Video().stop();
      $("#video-container #currentTime, #video-container #duration").text("0:00:00");
      $("#media-name").text("");
      $(video).attr('src', "").removeAttr('src');
    }

    $("#sidebar").empty();
    for (var i = 0; i < playList.length; i++) {
      $("#sidebar").append(`<div class="item" data-video-path="${playList[i].path}" data-video-index="${i}"> <a class="play">${playList[i].name}</a> <a class="trash"> <i class="trash icon"></i> </a> </div>`);
    }

  });
});

$("#openDirVideos").on('click', function (e) {
  new VideosDir(function (err, inputTag) {

    fs.readdir(inputTag.files[0].path, 'utf8', (err, data) => {
      if (err) console.log(err);

      let videos = [];
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
        new Video().play(0, function (currentVideo) {

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
  new ERR("Not Found", `Sorry, "${el.getAttribute("rel")}" section is in development phase.`);
});

$("#topNav #about").on("click", function () {
  $("#errorModal .ui.header, #errorModal .description p").text("");
  $("#errorModal .header").text("about");
  $("#errorModal .description p").html("  ");

  $("#errorModal").modal("show");
});


$("#video-container").on("click", "#video-play-pause", togglePlayVideo);

// NOTE: To show video controllers on mouse move and cursor
let mouseArray = [];
$(document).on("mousemove", () => {
  let show = true, oldX = event.pageX;
  mouseArray.push(oldX);
  $("#bottom-caption").show();
  $('#player').css('cursor', 'default');
  setTimeout(function () {
    show = false;
    setTimeout(function() {
      if (!show && oldX === mouseArray[mouseArray.length-1]) {
        $('#player').css('cursor', 'none');
        $("#bottom-caption").hide();
      }
    }, 8e2);
  }, 8e2);
});


$("#video-container #progress-container").on('click', function (e) {
  if (video.readyState === 4) {
    let container = this.parentElement,
    mouseX = e.pageX - container.offsetLeft,
    containerWidth = window.getComputedStyle(this).getPropertyValue('width');
    containerWidth = containerWidth.substr(0, containerWidth.length - 2);
    let precent = parseInt((mouseX / containerWidth) * 100);
    video.currentTime = (mouseX/containerWidth)*video.duration;
    $("#video-container #currentTime").text(video.currentTime.toHHMMSS());
    $("#progress-bar").css("width", parseInt(video.currentTime / video.duration * 100) + "%");
  }
});

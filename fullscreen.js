function fullScreen() {
  // Get a reference to the element you want to make fullscreen
  let element = document.documentElement; // This selects the whole document

  // Check if fullscreen is available
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // IE/Edge
    element.msRequestFullscreen();
  } else {
    console.log("Fullscreen not available in this Browser");
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }  
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    fullScreen();
  } else {
    if (document.exitFullscreen) {
      exitFullscreen();
    }
  }
}

function getFullScreenBtn(){
  const fullScreenBtn = document.createElement("button");
  fullScreenBtn.className = "p-2 text-white text-xl fixed top-5 right-5 z-10";
  fullScreenBtn.setAttribute("id", "fullScreenBtn");
  fullScreenBtn.innerHTML = "⛶";
  fullScreenBtn.addEventListener("click", toggleFullscreen);
  return fullScreenBtn;
}
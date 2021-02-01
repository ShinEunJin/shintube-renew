const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progressCircle = document.getElementById("progressCircle");
const progressBar = document.getElementById("progressBar");
const comment = document.getElementById("jsAddComment");

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
}

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        volumeRange.value = videoPlayer.volume;
    } else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.removeEventListener("click", exitFullScreen);
    fullScrnBtn.addEventListener("click", goFullScreen);
    document.exitFullscreen();
}

function goFullScreen() {
    videoContainer.requestFullscreen();
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullScrnBtn.removeEventListener("click", exitFullScreen);
        fullScrnBtn.addEventListener("click", goFullScreen);
    }
})

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${secondsNumber > 3600 ? hours + ":" : ""}${minutes}:${totalSeconds}`;
}

function getCurrentTime() {
    currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime() {
    const totalTimeString = formatDate(videoPlayer.duration);
    totalTime.innerHTML = totalTimeString;
}

function handleScreenClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleSpace(event) {
    if (comment.compositionend) {
        if (event.key == " ") {
            event.preventDefault();
            if (videoPlayer.paused) {
                videoPlayer.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                videoPlayer.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }
}

function handleCenterIconPause() {
    const videoCenter = document.createElement("div")
    const pauseIcon = document.createElement("i");
    videoCenter.classList.add("videoPlayer__center");
    pauseIcon.setAttribute("class", "fas fa-pause");
    videoContainer.appendChild(videoCenter);
    videoCenter.appendChild(pauseIcon);
    const fadePlayBtn = videoCenter.animate([
        { transform: "scale(1, 1)" },
        { transform: "scale(1.2, 1.2)" }
    ], 300);
    fadePlayBtn.addEventListener("finish", () => {
        videoContainer.removeChild(videoCenter);
    })
}

function handleCenterIconPlay() {
    const videoCenter = document.createElement("div")
    const playIcon = document.createElement("i");
    videoCenter.classList.add("videoPlayer__center");
    playIcon.setAttribute("class", "fas fa-play");
    videoContainer.appendChild(videoCenter);
    videoCenter.appendChild(playIcon);
    const fadePlayBtn = videoCenter.animate([
        { transform: "scale(1, 1)" },
        { transform: "scale(1.2, 1.2)" }
    ], 300);
    fadePlayBtn.addEventListener("finish", () => {
        videoContainer.removeChild(videoCenter);
    })
}

async function autoPlay() {
    await videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    registerView();
}

function handleVolumeEnter() {
    volumeRange.style.display = "block";
    if (volumeRange.style.display === "block") {
        volumeRange.addEventListener("mouseenter", () => {
            volumeRange.style.opacity = "block";
        })
    }
    volumeRange.addEventListener("mouseleave", () => {
        volumeRange.removeAttribute("style");
    })
}

function handleDrag(event) {
    const {
        target: { value }
    } = event;
    videoPlayer.volume = value;
}

function handleProgress() {
    const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressCircle.style.width = `${percent}%`;
}

function handleProgressBar(event) {
    const position = (videoPlayer.duration / progressBar.offsetWidth) * event.offsetX;
    videoPlayer.currentTime = position;
}

function init() {
    autoPlay();
    videoPlayer.volume = 0.5; // 모바일 환경 고려
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    volumeBtn.addEventListener("mouseenter", handleVolumeEnter);
    volumeRange.addEventListener("input", handleDrag);
    fullScrnBtn.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("click", handleScreenClick);
    window.addEventListener("keydown", handleSpace);
    videoPlayer.addEventListener("pause", handleCenterIconPause);
    videoPlayer.addEventListener("play", handleCenterIconPlay);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("timeupdate", getCurrentTime);
    videoPlayer.addEventListener("timeupdate", handleProgress);
    progressBar.addEventListener("click", handleProgressBar);

    videoPlayer.addEventListener("pause", () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    })

    videoPlayer.addEventListener("play", () => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    })
}

if (videoContainer) {
    init();
}

//화살표 방향 누르면 시간 이동
//영상끝나면 다시보기 아이콘 추가
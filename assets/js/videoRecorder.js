const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideodata = (event) => {
    const { data: videoFile } = event;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile);
    link.download = `${videoRecorder.stream.id}.mp4`;
    document.body.appendChild(link);
    link.click();
}

const stopRecording = () => {
    videoRecorder.stop();
    recordBtn.removeEventListener("click", stopRecording);
    videoPreview.pause();
    recordBtn.addEventListener("click", getVideo);
    recordBtn.innerHTML = "Start Recording";
}

const startRecording = () => {
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", handleVideodata);
    recordBtn.addEventListener("click", stopRecording);
}

const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 }
        });
        videoPreview.srcObject = stream;
        videoPreview.play();
        recordBtn.innerHTML = "Stop Recording";
        streamObject = stream;
        startRecording();
    } catch (error) {
        recordBtn.innerHTML = "Sorry, can't record";
    } finally {
        recordBtn.removeEventListener("click", getVideo);
    }
}

function init() {
    recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
    init();
}
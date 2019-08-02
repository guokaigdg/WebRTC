'use strict';

const mediaStreamContrains = {
    video: { //采集视频
        frameRate: {ideal: 5},  //视频帧率最小20帧/s
  	    width: {ideal: 1920}, // 最小宽度 640, 理想宽度 1280
  	    height: {ideal: 1080},
        aspectRatio: 1/1,
    },
    audio:  { //采集音频
        echoCancellation: true,  //回音小消除
        noiseSuppression: true,  //降噪
        autoGainControl: true,   //自动增益
    }
};

const localVideo = document.querySelector('video');

function gotLocalMediaStream(mediaStream){
    localVideo.srcObject = mediaStream;
}

function handleLocalMediaStreamError(error){
    console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(mediaStreamContrains).then(
    gotLocalMediaStream
).catch(
    handleLocalMediaStreamError
);

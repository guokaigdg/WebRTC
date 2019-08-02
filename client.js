'use strict';

const mediaStreamContrains = {
  video: {
    frameRate: {min: 20},
    width: {min: 640, ideal: 1280},
    height: {min: 360, ideal: 720},
    aspectRatio: 16/9,
    facingMode: "user"
  },
  audio: {
    echoCancellation: false,
    noiseSuppression: true,
    autoGainControl: true
  }
};


const localVideo = document.querySelector('#capture');
const recvideo = document.querySelector('#replay');

var stream;
function gotLocalMediaStream(mediaStream){
  localVideo.srcObject = stream = mediaStream;
}

function handleLocalMediaStreamError(error){
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(mediaStreamContrains).then(
  gotLocalMediaStream
).catch(
  handleLocalMediaStreamError
);
// navigator.mediaDevices.enumerateDevices().then((list) => {
//   console.log("origin:", list);
// })

var buffer;
var btn_record = document.querySelector("#record");
var btn_play = document.querySelector("#recplay");
var btn_download = document.querySelector("#download");

btn_record.addEventListener("click", function() {
  startRecord();
});
btn_play.addEventListener("click", function() {
  play();
});
btn_download.addEventListener("click", function() {
  download();
})

// 当该函数被触发后，将数据压入到 blob 中
function handleDataAvailable(e){
  if(e && e.data && e.data.size > 0){
    buffer.push(e.data);
    btn_play.removeAttribute("disabled");
  }
}
var mediaRecorder
function startRecord(){

  buffer = [];

  // 设置录制下来的多媒体格式 
  var options = {
    mimeType: 'video/webm;codecs=h264'
  }

  // 判断浏览器是否支持录制
  if(!MediaRecorder.isTypeSupported(options.mimeType)){
    console.error(`${options.mimeType} is not supported!`);
    return;
  }

  try{
    // 创建录制对象
    mediaRecorder = new MediaRecorder(window.stream, options);
  }catch(e){
    console.error('Failed to create MediaRecorder:', e);
    return;
  }
  btn_record.setAttribute("disabled", true);

  // 当有音视频数据来了之后触发该事件
  mediaRecorder.ondataavailable = handleDataAvailable;
  // 开始录制
  mediaRecorder.start(10);
}
function play() {
  mediaRecorder.ondataavailable = null
  var blob = new Blob(buffer, {type: 'video/webm'});
  recvideo.src = window.URL.createObjectURL(blob);
  recvideo.srcObject = null;
  recvideo.controls = true;
  recvideo.play();
  btn_record.removeAttribute("disabled");
  btn_download.removeAttribute("disabled");

}
function download() {
  var blob = new Blob(buffer, {type: 'video/webm'});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');

  a.href = url;
  a.style.display = 'none';
  a.download = 'aaa.webm';
  a.click();

}
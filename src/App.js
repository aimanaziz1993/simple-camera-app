import React, { useEffect, useRef, useState } from "react";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
// import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

function App() {
  let environment = "production"
  if (environment !== "development") {
    if (window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`)
    }
  }

  const fpPromise = FingerprintJS.load({ apiKey: "GzuVdUvjogngbi8Qrgrp" });

  let info = {};
  let blobs = [];
  let stream;
  let mediaRecorder;

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  // const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const getVideoStream = async () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
     await navigator.mediaDevices
      .getUserMedia(
        { 
          audio: false, 
          video: { width: w, height: h, facingMode: "environment" },
        })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;

        video.onloadedmetadata = function(e) {
          video.width = w
          video.height = h
          // setStream(stream)
          video.play();
        }
        
      })
      .catch((err) => {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(err);
      })
  }

  const takePhoto = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = w;
    photo.height = h;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    setHasPhoto(true)

    var resultDiv = document.querySelector('.result')
    resultDiv.style.display = 'block';
    resultDiv.style.zIndex = '2';
    var takeVideoDiv = document.querySelector('#recordingBtn');
    takeVideoDiv.style.display = 'none';
  }

  const handleCloseSnapPhoto = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    var resultDiv = document.querySelector('.result')
    resultDiv.style.display = 'none';
    resultDiv.style.zIndex = '-1';

    var takeVideoDiv = document.querySelector('#recordingBtn');
    takeVideoDiv.style.display = 'block';

    let photo = photoRef.current;

    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    setHasPhoto(false)
  }

  const handleCloseRecordingPreview = () => {
    var resultDiv = document.querySelector('.recorded')
    resultDiv.style.display = 'none';
    resultDiv.style.zIndex = '-1';
    document.querySelector('#stopBtn').style.display = "none";

    var takeVideoDiv = document.querySelector('#recordingBtn');
    takeVideoDiv.style.display = 'block';

    var recordedVideo = document.querySelector('video#recording');
    recordedVideo.src = null;
    setRecording(false);
    document.querySelector('#log').innerHTML = "";
    document.querySelector('#recordedTime').innerHTML = "";
  }

  // const startRecording = async () => {
  //   let data = []; // blob
  //   let recorder, dateStarted;

  //   if (stream) {

  //     const options = {
  //       mimeType: 'video/webm'
  //     }
  //     try {
  //       recorder = new MediaRecorder(stream, options);
  //     } catch (err) {
  //       try {
  //         recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
  //       } catch (error) {
  //         alert(error)
  //       }
  //     }
  //   }

  //   recorder.ondataavailable = (event) => {
  //     // alert(event.data.size)
  //     if (event.data && event.data.size > 0) {
  //       data.push(event.data);
  //     }
  //   }
  //   recorder.start();
  //   setRecording(true);

  //   dateStarted = new Date().getTime();

  //   let stopped = new Promise((resolve, reject) => {
  //     recorder.onstop = resolve;
  //     recorder.onerror = event => reject(event.name);
  //   });

  //   document.querySelector('#stopBtn').addEventListener('click', function() {
  //     wait(0).then(
  //       () => recorder.state === "recording" && recorder.stop()
  //     )
  //   })

  //   let recorded;
    
  //   let count = 0;
  //   (function looper() {
        
  //       if(recorder.state === "inactive") {
  //           return;
  //       }
  //       document.querySelector('#stopBtn').style.display = "block";
  //       document.querySelector('#recordedTime').innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
  //       setTimeout(looper, 1000);
  //       count++

  //       if (count === recordingTimeMS) {
  //         recorded = wait(0).then(
  //           () => recorder.state === "recording" && recorder.stop()
  //         );
  //       }
  //   })();

  //   return Promise.all([
  //     stopped,
  //     recorded
  //   ])
  //   .then(() => {
  //     console.log(data)
  //     if (data[0].size > 0) {
  //       alert(data[0].size)
  //       setHasRecorded(true);
  //       setRecording(false);

  //       let type = "video/webm";
  //       if (iphone) {
  //         type = "video/mp4";
  //       }

  //       let recordedBlob = new Blob(data, {
  //         type: type
  //       });

  //       var takeVideoDiv = document.querySelector('#recordingBtn');
  //       takeVideoDiv.style.display = 'none';
  //       document.querySelector('#stopBtn').style.display = "none";

  //       var recordDiv = document.querySelector('.recorded');
  //       var recordedVideo = document.querySelector('video#recording');
  //       // recordedVideo.src = window.URL.createObjectURL(recordedBlob);

  //       recordedVideo.src = null;
  //       recordedVideo.srcObject = null;
  //       recordedVideo.src = window.URL.createObjectURL(recordedBlob);
  //       recordedVideo.controls = true;
  //       // recordedVideo.controls = true;
  //       // recordedVideo.loop = true;
  //       // recordedVideo.muted = true;
  //       // recordedVideo.playsInline = true;
  //       // recordedVideo.controlsList = "nofullscreen";
  //       // recordedVideo.width = w;
  //       // recordedVideo.height = h;
  //       // recordedVideo.play();

  //       log("Recorded: " + formatBytes(recordedBlob.size));

  //       recordDiv.style.display = 'block';
  //       recordDiv.style.zIndex = '2';
  //     }
  //   })
  //   .catch((err) => {
  //     alert(err)
  //   })
  // }

  useEffect(() => {
    getVideoStream();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function log(msg) {
    let logElement = document.getElementById("log");
    logElement.innerHTML += msg + "\n";
  }

  function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
  }

  function calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if(hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
  }

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  async function startRecording()
  {
    const w = window.innerWidth;
    const h = window.innerHeight;

    fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((result) => {
        window.localStorage.setItem("fingerprint", JSON.stringify(result));
    });

    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: w, height: h, facingMode: "environment" } });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      // Let's append blobs for now, we could also upload them to the network.
      if (event.data) blobs.push(event.data);
    }
    mediaRecorder.onstop = doPreview;

    mediaRecorder.start();
    setRecording(true);

    let dateStarted = new Date().getTime();
    let count = 0;
    (function looper() {
        
        if(mediaRecorder.state === "inactive") {
            return;
        }
        document.querySelector('#stopBtn').style.display = "block";
        document.querySelector('#recordedTime').innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
        setTimeout(looper, 1000);
        count++

        if (count === 61) {
          wait(0).then(
            () => mediaRecorder.state === "recording" && mediaRecorder.stop()
          );
        }
    })();

    document.querySelector('#stopBtn').addEventListener('click', function() {
      endRecording();
    })
  }

  function endRecording()
  {
      // Let's stop capture and recording
      if(mediaRecorder.state === "inactive") {
          return;
      }
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      setHasRecorded(true);
      setRecording(false);
  }

  function doPreview()
  {
      if (!blobs.length)
          return;
      // Let's concatenate blobs to preview the recorded content
      var recordedVideo = document.querySelector('video#recording');
      recordedVideo.src = URL.createObjectURL(new Blob(blobs, { type: mediaRecorder.mimeType }));

      const w = window.innerWidth;
      const h = window.innerHeight;

      var takeVideoDiv = document.querySelector('#recordingBtn');
      takeVideoDiv.style.display = 'none';
      document.querySelector('#stopBtn').style.display = "none";

      var recordDiv = document.querySelector('.recorded');
      recordedVideo.controls = true;
      recordedVideo.controlsList = "nofullscreen";
      recordedVideo.width = w;
      recordedVideo.height = h;

      log("Recorded: " + formatBytes(blobs[0].size));

      recordDiv.style.display = 'block';
      recordDiv.style.zIndex = '2';

      // const downloadButton = document.querySelector('button.download');
      // downloadButton.addEventListener('click', () => {
      //   const blob = new Blob(blobs, {type: 'video/mp4'});
      //   const url = window.URL.createObjectURL(blob);
      //   const a = document.createElement('a');
      //   a.style.display = 'none';
      //   a.href = url;
      //   a.download = 'test.mp4';
      //   document.body.appendChild(a);
      //   a.click();
      //   setTimeout(() => {
      //     document.body.removeChild(a);
      //     window.URL.revokeObjectURL(url);
      //   }, 100);
      // });

      const uploadButton = document.querySelector('button#saveVideo');
      var videoRecording = document.querySelector('#recording');

      console.log(typeof videoRecording.src)
      uploadButton.addEventListener('click', () => {
        const blob = new Blob(blobs, {type: 'video/mp4'});
        var fileObj = new File([blob], 'filename.mp4', { type: "video/mp4" });
        handleFileUpload(fileObj, function(response) {
          console.log(response);
        });
      })
  }

  const handleFileUpload = async (file, callback) => {

    info.fingerprint = JSON.parse(window.localStorage.getItem("fingerprint"));

    let uploadArray = [];
    uploadArray.push(file);

    const body = new FormData();
    for (const key of Object.keys(uploadArray)) {
      body.append("files[]", uploadArray[key]);
    }
    body.append("details", JSON.stringify(info));

    let url = "";

    if (environment === "development") {
      url = info.hash
        ? `http://127.0.0.1:8000/api/users?u_=${info.hash}`
        : `http://127.0.0.1:8000/api/users`;
    } else if (environment === "production") {
      url = info.hash
        ? `https://findwitness.sg/api/users?u_=${info.hash}`
        : `https://findwitness.sg/api/users`;
    }

    makeXMLHttpRequest(url, body, function(progress) {
        if (progress !== 'upload-ended') {
            callback(progress);
            return;
        }
    });
  }

  function makeXMLHttpRequest(url, data, callback) {
    var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status === 200) {
              if (request.responseText === 'success') {
                  callback('upload-ended');
                  return;
              }
              if (request.status === 200) {
                alert("Evidence successfully submitted");
              } else {
                alert("Evidence uploading failed");
                window.location.reload();
              }
              // alert(request.responseText);
              return;
          }
      };
      request.upload.onloadstart = function() {
          setSubmitting(true);
          callback('PHP upload started...');
      };
      request.upload.onprogress = function(event) {
        setSubmitting(true);
          callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
      };
      request.upload.onload = function() {
        setSubmitting(true);
          callback('progress-about-to-end');
      };
      request.upload.onload = function() {
          callback('PHP upload ended. Getting file URL.');
          setSubmitting(false);
      };
      request.upload.onerror = function(error) {
        setSubmitting(false)
        callback('PHP upload failed.');
      };
      request.upload.onabort = function(error) {
        setSubmitting(false)
        callback('PHP upload aborted.');
      };
      request.open('POST', url);
      request.send(data);
  }

  function supportsRecording(mimeType)
  {
      if (!window.MediaRecorder)
          return false;
      if (!MediaRecorder.isTypeSupported)
          return mimeType.startsWith("audio/mp4") || mimeType.startsWith("video/mp4");
      return MediaRecorder.isTypeSupported(mimeType);
  }

  return (
    <div className="App">
      <div className="top">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
        <button id="stopBtn">
          <StopCircleOutlinedIcon />
        </button>
        <span id="recordedTime"></span>
        </div>
        <pre id="log"></pre>
      </div>
      <div className="camera">
        <video ref={videoRef} playsInline autoPlay muted></video>
        <button className="cameraBtn" onClick={takePhoto}>
          <CameraAltOutlinedIcon />
        </button>
        <div id="recordingBtn" className="recordingBtn">
          <button className={ `record ${recording ? 'recording' : ''}` } onClick={startRecording} disabled={recording}></button>
        </div>
      </div>
      
      <div className={ `result ${hasPhoto ? 'hasPhoto' : ''}` }>
        <canvas ref={photoRef}></canvas>
        <button onClick={handleCloseSnapPhoto}>
          <CloseOutlinedIcon />
        </button>
        <button className="save">
          <CloudUploadOutlinedIcon />
        </button>
      </div>

      <div className={ `recorded ${hasRecorded ? 'hasRecorded' : ''}` }>
        <video id="recording" autoPlay playsInline muted loop></video>
        <button onClick={handleCloseRecordingPreview}>
          <CloseOutlinedIcon />
        </button>
        <button id="saveVideo" className="save">
          { submitting ? 'Submission in progress..' : (
            <>
              <CloudUploadOutlinedIcon />
            </>
          ) }
        </button>
        {/* <button className="download">
          <DownloadOutlinedIcon />
        </button> */}
      </div>
    </div>
  );
}

export default App;

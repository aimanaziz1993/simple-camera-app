import React, { useEffect, useRef, useState } from "react";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

import SuccessPage from "./components/SuccessPage";
import SecurePage from "./components/SecurePage";
import ProgressCircle from "./components/CircularProgress";
import Hint from "./components/Hint";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

function App() {
  const environment = process.env.REACT_APP_ENV || "development";

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

  const [recording, setRecording] = useState(false);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [preview, setPreview] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openSecureModal, setOpenSecureModal] = useState(false);

  const getVideoStream = async () => {
    const w = window.screen.width;
    const h = window.screen.height;
     await navigator.mediaDevices
      .getUserMedia(
        { 
          audio: true, 
          video: 
          { 
            width: 640,
            height: 480,
            facingMode: "environment" 
          },
          // audioBitsPerSecond: 64 * 1000, // 128 kbit/s
          // videoBitsPerSecond: 64 * 1000,
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

      try {
        const checkFp = JSON.parse(window.localStorage.getItem("fingerprint"));

        if (checkFp === null) {
          setOpenSecureModal(true);
        }
      } catch (error) {
        
      }
  }

  // const takePhoto = () => {
  //   const w = window.screen.width;
  //   const h = window.screen.height;

  //   let video = videoRef.current;
  //   let photo = photoRef.current;

  //   photo.width = w;
  //   photo.height = h;

  //   let ctx = photo.getContext('2d');
  //   ctx.drawImage(video, 0, 0, w, h);
  //   setHasPhoto(true)

  //   var resultDiv = document.querySelector('.result')
  //   resultDiv.style.display = 'block';
  //   resultDiv.style.zIndex = '2';
  //   var takeVideoDiv = document.querySelector('#recordingBtn');
  //   takeVideoDiv.style.display = 'none';
  // }

  const handleCloseSnapPhoto = () => {
    const w = window.screen.width;
    const h = window.screen.height;

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
    setPreview(false);
    document.querySelector('#log').innerHTML = "";
    document.querySelector('#recordedTime').innerHTML = "";
    document.querySelector('#text').innerHTML = "";
    document.querySelector('#recordedBlobSize').innerHTML = "";

    setOpenSuccessModal(false)
    setOpenSecureModal(false)

    let count = 3;
    (function countStart() {

        document.querySelector('#text').innerHTML = count;
        setTimeout(countStart, 1025);
        count--

        if (count === 0) {
          setTimeout(() => {
            document.querySelector('#text').style.display = "none";
            startRecording();
          }, 725)
        }
    })();
  }

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
    fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((result) => {
        window.localStorage.setItem("fingerprint", JSON.stringify(result));
    });

    blobs = [];
    const MAX_BLOB_SIZES = 8000000; // 9900000 = 9.9MB, 10000000 = 10MB, 9999999 == 9.999 MB, 7000000 = 7MB
    stream = await navigator.mediaDevices.getUserMedia(
      { 
        audio: true, 
        video: 
          { 
            width: 640,
            height: 480,
            facingMode: "environment" 
          },
        // audioBitsPerSecond: 64 * 1000, // 64 kbit/s
        // videoBitsPerSecond: 64 * 1000, 
      });

    // 1250000, 920000 = 115kb/s
    mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond : 64 * 1000, videoBitsPerSecond : 920000});
    mediaRecorder.ondataavailable = (event) => {
      // Append parts of blobs, can also upload them to the network.
      if (event.data && event.data.size > 0) {
        blobs.push(event.data)
      };
      // get Blobs for new compiled sizes
      const newSizesBlob = new Blob(blobs, { type: "video/mp4" });
      document.querySelector('#recordedBlobSize').innerHTML = " | " + formatBytes(newSizesBlob.size);
    }
    mediaRecorder.onstop = doPreview;

    mediaRecorder.start();
    setRecording(true);

    let dateStarted = new Date().getTime();
    let count = 0;
    (function looper() {

        const checkSizes = new Blob(blobs, { type: "video/mp4" });
        
        if(mediaRecorder.state === "inactive") {
            return;
        }
        document.querySelector('#stopBtn').style.display = "block";
        document.querySelector('#text').innerHTML = "";
        document.querySelector('#recordedTime').innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
        setTimeout(looper, 1000);
        count++
        mediaRecorder.requestData();

        if (count === 31 || checkSizes.size >= MAX_BLOB_SIZES) {
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
    setPreview(true)
    if (!blobs.length)
        return;
    // Let's concatenate blobs to preview the recorded content
    var recordedVideo = document.querySelector('video#recording');
    var newBlobs = new Blob(blobs, { type: "video/mp4" });
    // console.log('new compiled blobs', newBlobs)
    recordedVideo.src = URL.createObjectURL(newBlobs);

    const w = window.screen.width;
    const h = window.screen.height;

    var takeVideoDiv = document.querySelector('#recordingBtn');
    takeVideoDiv.style.display = 'none';
    document.querySelector('#stopBtn').style.display = "none";
    document.querySelector('#text').innerHTML = "";

    document.querySelector('#recordedTime').style.animation = "none";

    var recordDiv = document.querySelector('.recorded');
    recordedVideo.controls = true;
    recordedVideo.controlsList = "nofullscreen";
    recordedVideo.width = w;
    recordedVideo.height = h;

    log("Recorded: " + formatBytes(newBlobs.size));

    recordDiv.style.display = 'block';
    recordDiv.style.zIndex = '2';

    // const uploadButton = document.querySelector('button#saveVideo');
    // uploadButton.addEventListener('click', () => {
      const blob = new Blob(blobs, {type: 'video/mp4'});
      const generatedUidFilename = Math.random().toString(36).substr(2);

      var fileObj = new File([blob], '_' + generatedUidFilename + '_.mp4', { type: "video/mp4" });
      handleFileUpload(fileObj, function(response) {
        document.querySelector('button#saveVideo').style.display = 'none';
      });
    // })
  }

  // const handleCloseModal = ()

  const handleFileUpload = async (file, callback) => {

    info.fingerprint = JSON.parse(window.localStorage.getItem("fingerprint"));
    // info.fingerprint.visitorId = null

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
        console.log('progress', progress)
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
              var responseJson = JSON.parse(request.responseText);
              if (request.responseText === 'success') {
                  callback('upload-ended');
                  return;
              }
              if (request.status === 200) {
                console.log("Evidence successfully submitted");

                if (responseJson.data.user?.fingerprint === null) {
                  // setTimeout(() => {
                  //   setOpenSecureModal(true)
                  //   setResponseData(responseJson.data)
                  // }, 1000)
                } else {
                  setTimeout(() => {
                    setOpenSuccessModal(true)
                  }, 1000)
                }
                
              } else {
                console.log("Evidence uploading failed");
                window.location.reload();
              }
              return;
          }
      };
      request.upload.onloadstart = function() {
          setSubmitting(true);
          callback('PHP upload started...');
      };
      request.upload.onprogress = function(event) {
        setSubmitting(true);
        setProgress(event.loaded / event.total * 100)
        callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
      };
      request.upload.onload = function() {
        setSubmitting(true);
        callback('progress-about-to-end');
      };
      request.upload.onload = function() {
        callback('PHP upload ended. Getting file URL.');
        setTimeout(() => {
          setSubmitting(false);
          setProgress(0)
        }, 2000)
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

  useEffect(() => {
    getVideoStream();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">

      {!preview ? <Hint props={recording} 
        style={
          { 
            display: 'block', 
          }
        } /> : ""}

      {openSuccessModal ? (<>
        <SuccessPage props={openSuccessModal} close={handleCloseRecordingPreview} />
      </>) : ("")}

      {openSecureModal ? (<>
        <SecurePage props={openSecureModal} fpPromise={fpPromise} close={handleCloseRecordingPreview} />
      </>) : ("")}

      { submitting ? (
        <ProgressCircle value={progress} />
      ) : (<></>) }

      <div className="overlay">
        <div className="overlayText">
          <span id="text" className="text"></span>
        </div>
      </div>

      <div className="top">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
          
          <span id="recordedTime"></span>
          &nbsp; <span id="recordedBlobSize"></span>
        </div>
        <pre id="log"></pre>
      </div>
      <div className="camera">
        <video ref={videoRef} playsInline autoPlay muted></video>
        <div id="recordingBtn" className="recordingBtn">
          <button id="stopBtn"
          >
            <StopRoundedIcon fontSize="large" style={{color:"white"}} />
          </button>
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
        {/* <button>
          <CloseOutlinedIcon />
        </button> */}
        <button id="saveVideo" className="save">
          { submitting ? 'Submission in progress..' : (
            <>
              <CloudUploadOutlinedIcon />
            </>
          ) }
        </button>
      </div>
    </div>
  );
}

export default App;

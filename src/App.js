import React, { useEffect, useRef, useState } from "react";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

import SuccessPage from "./components/SuccessPage";
import SecurePage from "./components/SecurePage";
import LinearProgressWithLabel from "./components/LinearProgressWithLabel";
import Hint from "./components/Hint";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

import { Player } from "@lottiefiles/react-lottie-player";
import { post } from "./API/Api";

function App() {
  const screenSize = window.screen.width;
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

  const [registered, setRegistered] = useState(false);

  const [introLoading, setIntroLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [preview, setPreview] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [submissionID, setSubmissionID] = useState(0);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openSecureModal, setOpenSecureModal] = useState(false);

  const checkRegistration = async () => {
    await fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((result) => {
        if (result.visitorFound) {
          const body = new FormData();
          body.append("fingerprint", `${result.visitorId}`);

          var url = "";
          // Run api to check whether this user has registered before
          if (environment === "development") {
            url = "http://127.0.0.1:8000/api/road-angel-contacts/fingerprintCheck"
          } else if (environment === "production") {
            url = "https://findwitness.sg/api/road-angel-contacts/fingerprintCheck"
          }

          post(body, url).then((response) => {
            if (typeof response.data !== "undefined" && response.data !== null && response.data) {
              setRegistered(true);
              window.localStorage.setItem("fingerprint", JSON.stringify(result));
              window.localStorage.setItem("user", JSON.stringify(response.data));
              document.getElementById("firstCheck").classList.add("invisible");
              getVideoStream();
            } else {
              document.getElementById("firstCheck").classList.remove("invisible");
            }
          })
        } else {
          alert("We couldn't identify you at the moment. Please check your network connection and refresh this page. Thank you.")
          // window.location.reload();
        }
    });
  }

  const goToRegister = () => {
    let url = "";
    if (environment === "development") {
      url = "http://127.0.0.1:8000/activate"
    } else if (environment === "production") {
      url = "https://findwitness.sg/activate"
    }
    window.open(url);
  }

  const getVideoStream = async () => {
    setIntroLoading(true);
    const w = window.screen.width;
    const h = window.screen.height;

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true, 
      }
      navigator.geolocation.getCurrentPosition(successGeolocation, errorGeolocation, options)
    }
    
    fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((result) => {
        if (result.visitorFound) {
          window.localStorage.setItem("fingerprint", JSON.stringify(result));
        } else {
          // setOpenSecureModal(true);
          // window.location.reload();
        }
    });

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
      })
    .then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;

      setIntroLoading(false);

      setTimeout(() => {
        document.querySelector('#intro').style.zIndex = -1;
      }, 500)

      video.onloadedmetadata = function(e) {
        video.width = w
        video.height = h
        // setStream(stream)
        video.play();
        
        document.getElementById('guidelines').classList.remove("invisible");
      }
    })
    .catch((err) => {
      console.error(err);
      // window.location.href= "https://google.com"
      window.location.reload();
    })

    setTimeout(() => {
      let count = 3;
      (function countStart() {
        document.querySelector('#text').style.display = "block";
          
          setTimeout(countStart, 1025);
          document.querySelector('#text').innerHTML = count;
          count--

          if (count <= -1) {
            document.querySelector('#text').style.display = "none";
            setTimeout(() => {
              document.querySelector('#text').innerHTML = "";
            }, 500)
          }

          if (count === -1) {
            document.querySelector('.record').style.display = "block";
            startRecording();
          }
      })();
    }, 1000)
  }

  function successGeolocation(position) {
    window.localStorage.setItem("coordinates", JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  }

  function errorGeolocation(error) {
    console.log(error)
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
    // document.querySelector('#text').innerHTML = "";
    document.querySelector('#recordedBlobSize').innerHTML = "";

    setOpenSuccessModal(false)
    setOpenSecureModal(false)
  }

  // function log(msg) {
  //   let logElement = document.getElementById("log");
  //   logElement.innerHTML += msg + "\n";
  // }

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
      });

    // Bitrate - 1250000, 920000 = 115kb/s
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

    fpPromise
      .then((fp) => fp.get({ extendedResult: true }))
      .then((result) => {
        window.localStorage.setItem("fingerprint", JSON.stringify(result));
    });

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

    // log("Recorded: " + formatBytes(newBlobs.size));

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

  const handleFileUpload = async (file, callback) => {

    var coordinates = JSON.parse(window.localStorage.getItem("coordinates"));

    if (coordinates !== null) {
      info.latitude = coordinates.latitude
      info.longitude = coordinates.longitude
    }

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
      url = `http://127.0.0.1:8000/api/road-angel-contacts/submission`;
    } else if (environment === "production") {
      url = `https://findwitness.sg/api/road-angel-contacts/submission`;
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
            let id = 0;
              if (request.responseText === 'success') {
                  callback('upload-ended');
                  return;
              }
              if (request.status === 200) {
                console.log("Evidence successfully submitted");

                var data = JSON.parse(request.responseText);

                if (data.data.submission.length > 0) {
                  id = data.data.submission[0].id || 0;
                }

                setTimeout(() => {
                  setOpenSuccessModal(true)
                  setSubmitting(false);
                  setProgress(0);
                  setSubmissionID(id)
                }, 500)
                
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
    if (screenSize <= 500) {
      checkRegistration();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // new ResizeObserver((entries) => {
  //   entries.forEach((entry) => {
  //     document.documentElement.style.setProperty("--webkit-footer-gap", `${entry.contentRect.height}px`);
  //   }).observe(document.querySelector(".webkit-gap"))
  // })
    

  return (
    <div className="App">

      { screenSize <= 500 ? (
      <>

      <div id="firstCheck" className={ `invisible absolute top-0 left-0 right-0 bottom-0 pb-32 w-full h-screen z-30 overflow-hidden bg-white flex flex-col items-center justify-around` }>

        <div className="w-full">
          <p className="w-full text-lg text-center font-semibold text-slate-600">Oops!</p>
          <p className="w-full text-base text-center font-light text-slate-500">You need to REGISTER!</p>
        </div>

        <div className="mx-auto flex h-64 w-64 flex-shrink-0 items-center justify-center rounded-full">
            <Player
              src="https://assets9.lottiefiles.com/packages/lf20_tl52xzvn.json"
              background="transparent"
              speed="1"
              style={{ width: "100%", height: "100%" }}
              autoplay
              keepLastFrame
            ></Player>
        </div>

        <div className="w-full">
          <p className="w-full text-base text-center font-light text-slate-500">You may revisit this website once you</p>
          <p className="w-full text-base text-center font-light text-slate-500">register and verify your device.</p>
        </div>

        <div className="on-footer w-full text-center">
          <button className="w-1/2 text-center rounded-full px-4 py-2 text-white registerBtn" style={{backgroundColor: '#C70937'}} onClick={goToRegister}>Register Now</button>
        </div>
      </div>

      {registered ? (
      <>
        <div id="intro" className={ `fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-30 overflow-hidden bg-gray-700 flex flex-col items-center justify-center ${!introLoading ? 'fade-in' : 'fade-in' }` }>
          <div className="fixed inset-x-0 top-16 z-50 mx-4 mb-4 rounded-lg bg-rose-700 p-4 md:relative md:mx-auto md:max-w-md">
            <p className="px-2 text-white text-center font-semibold">Please click <span className="text-xl">'Allow'</span> at the pop up alert. Thank you.</p>
          </div>

          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <p className="w-1/2 text-center font-semibold text-rose-700">Starting up camera <span className="dot-animate">...</span></p>
        </div> 
      </>
      ) : (<></>)}
      
      <div id="guidelines" className="absolute top-1 left-1 w-52 flex flex-col z-10 p-1 rounded opacity-90 font-light text-white text-sm fade-in invisible" style={{backgroundColor: "#898786"}}>
        <p className="underline">Guidelines</p>
        <ul>
          <li>1. Recording will auto start in 3 seconds</li>
          <li>2. Ensure the scene is properly get recorded</li>
          <li>3. Tap record button once again to stop recording and enter additional details to complete submission</li>
        </ul>
      </div>

      {!preview ? <Hint props={recording} style={{ display: 'block', }} /> : ""}

      {openSuccessModal ? (<>
        <SuccessPage props={openSuccessModal} id={submissionID} close={handleCloseRecordingPreview} />
      </>) : ("")}

      {openSecureModal ? (<>
        <SecurePage props={openSecureModal} fpPromise={fpPromise} close={handleCloseRecordingPreview} />
      </>) : ("")}

      { submitting ? (
        <div className="progress">
          <LinearProgressWithLabel value={progress} />
        </div>
      ) : (<></>) }

      <div className="overlay">
        <div className="overlayText">
          <span id="text" className="text"></span>
        </div>
      </div>
      <div className={`top opacity-90 z-40 rounded-full px-4 py-2`} style={recording ? {backgroundColor: "#898786"} : {}}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
          <span id="recordedTime"></span>
          &nbsp; <span id="recordedBlobSize"></span>
        </div>
        <pre id="log" className="logged"></pre>
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
      <div className={ `recorded ${hasRecorded ? 'hasRecorded' : ''}` }>
        <video id="recording" autoPlay playsInline muted loop></video>
        <button id="saveVideo" className="save">
          { submitting ? 'Submission in progress..' : (
            <>
              <CloudUploadOutlinedIcon />
            </>
          ) }
        </button>
      </div>
      </>
      ) : 
      (
      <>
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-slate-300 opacity-75 flex flex-col items-center justify-center">
        <h2 className="w-full p-60 text-center text-5xl text-red-800">You have to access this site with a mobile device.</h2>
        <p className="w-1/2 text-center text-3xl text-red-800">+65 6816 2969</p>
        <p className="w-1/2 text-center text-2xl text-red-800">Please call us for further information. Thank you.</p>
      </div>
      </>
      ) }
    </div>
  );
}

export default App;

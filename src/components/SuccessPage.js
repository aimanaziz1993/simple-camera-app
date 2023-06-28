import React, { useEffect, useRef } from "react";
import { useTimer } from "./Timer";
import { post } from "../API/Api";
import { Player } from "@lottiefiles/react-lottie-player";

function SuccessPage({ props, id, close }) {
    const modalRef = useRef(null);
    const prop = props
    const time = useTimer();
    const environment = process.env.REACT_APP_ENV || "development";
    const submissionID = id || 0

    const handleClose = () => {
        window.location.href = "https://google.com"
    }

    const handleSubmit = () => {
        console.log('submit')
        var  victim_name = document.getElementById('victim_name');
        var  victim_mobile_no = document.getElementById('victim_mobile_no');

        const body = new FormData();
        body.append("id", `${submissionID}`);
        body.append("victim_name", `${victim_name.value || ""}`);
        body.append("victim_mobile_no", `${victim_mobile_no.value || ""}`);

        var url = "";
        // Run api to check whether this user has registered before
        if (environment === "development") {
            url = "http://127.0.0.1:8000/api/road-angel-contacts/update-submission"
        } else if (environment === "production") {
            url = "https://findwitness.sg/api/road-angel-contacts/update-submission"
        }

        post(body, url).then((response) => {
            if (response.status) {

                document.getElementById('successPrompt').classList.remove("invisible");
                document.getElementById('preForm').classList.add("invisible");

                setTimeout(() => {
                    window.location.href = "https://google.com"
                }, 3000)

                // document.getElementById("successAsset").classList.remove("invisible");
                // document.getElementById("successText").classList.remove("invisible");

                // setTimeout(() => {
                //     window.location.href = "https://google.com"
                // }, 2000)

                // document.getElementById('successImg').classList.remove("invisible");
                // document.getElementById("done").classList.remove("invisible");
            }
        })
    }

    useEffect(() => {
        if (modalRef.current) {
            if (prop) {
                modalRef.current.classList.remove('hidden')
            } else {
                modalRef.current.classList.add('hidden')
            }
        }

        if (time >= 15) {
            // window.location.href = "https://google.com"
        }
    }, [modalRef, prop, time])

    return (
    <>
        <main ref={modalRef} className="overflow-x-hidden bg-gray-200 font-sans text-gray-900 antialiased hidden">

            <div className="relative min-h-screen px-4 md:flex md:items-center md:justify-center">

                <div className="absolute inset-0 z-10 h-full w-full bg-black opacity-25"></div>

                <div id="successPrompt" className="invisible absolute inset-x-0 bottom-1/2 h-60 z-50 py-4 mx-0.5 mb-0.5 rounded-lg bg-white md:relative md:mx-auto md:max-w-md">
                    <div className="relative h-28 w-28 mx-auto rounded-full z-50">
                        <Player
                        src="https://assets5.lottiefiles.com/packages/lf20_pqnfmone.json"
                        background="transparent"
                        speed="1"
                        style={{ width: "100%", height: "100%" }}
                        autoplay
                        keepLastFrame
                        ></Player>
                    </div>
                    <p className="text-gray-700 text-sm text-center mb-4">
                        <span className="font-bold">Congratulations!</span> <br /> You have successfully submitted the submission.
                    </p>
                    <button className="absolute top-3.5 right-3.5 font-bold text-gray-400 text-base opacity-50" onClick={handleClose} style={{ maxWidth: "20px" }}>
                        <img src="/test/close-button.svg" alt="close" />
                    </button>

                    <div className="flex flex-row justify-center w-full mb-2">
                        <button className="w-1/2 text-center rounded px-4 py-2 text-white bg-gray-600" onClick={handleClose}>DONE</button>
                    </div>
                </div>

                <div id="preForm" className="fixed inset-x-0 bottom-0 z-50 mx-0.5 mb-0.5 rounded-lg bg-white md:relative md:mx-auto md:max-w-md" style={{ height: "20rem" }}>
                    <div className="items-center md:flex mb-2">
                        <div className="text-start px-4 md:mt-0 md:ml-6 md:text-left">

                            <button className="absolute top-3.5 right-3.5 font-bold text-gray-400 text-base" onClick={handleClose} style={{ maxWidth: "20px" }}>
                                <img src="/test/close-button.svg" alt="close" />
                            </button>

                            <p className="font-bold text-gray-700 text-sm pt-3">Evidence Submitted</p>
                            <p className="mt-4 text-xs text-gray-700">
                                Please fill up the form and call us at <strong>+6568162969</strong> <br /> within 48 hours to claim your
                                reward. Thank you.
                                <br />
                                <br />
                            </p>

                            <form id="victimForm" className="mb-2">
                                <div className="mb-1 text-xs">
                                    Victim Name / Next of Kin
                                </div>
                                <div className="mb-4 leading-5">
                                    <input id="victim_name" className="border h-8 w-full border-slate-200 text-xs" type="text" name="victim_name" />
                                </div>
                                <div className="mb-1 text-xs">
                                    Victim Mobile Number
                                </div>
                                <div className="mb-4 leading-5">
                                    <input id="victim_mobile_no" className="border h-8 w-full border-slate-200 text-xs" type="text" name="victim_mobile_no" />
                                </div>
                            </form>

                            <div className="flex flex-row justify-around w-full">
                                <button className="w-1/2 text-center text-sm rounded px-4 py-2 text-white me-1" style={{backgroundColor: '#C70937'}} onClick={handleSubmit}>SUBMIT</button>
                                <button className="w-1/2 text-center text-sm rounded px-4 py-2 text-white bg-slate-600" onClick={handleClose}>CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>

                <img id="successImg" className="absolute w-full h-screen z-50 inset-x-0 mx-0 fade-in invisible" src="/test/success.png" alt="success" /> 

                <div id="done" className="fixed bottom-0 w-full mb-4 text-center z-50 inset-x-0 mx-0 fade-in invisible">
                    <button className="w-1/2 text-center rounded px-4 py-2 text-white" style={{backgroundColor: '#C70937'}} onClick={handleClose}>DONE</button>
                </div>
            </div>
        </main>
    </>
    );
}
export default SuccessPage;
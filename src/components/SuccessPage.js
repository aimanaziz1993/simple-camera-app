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

    // const handleClose = () => {
    //     modalRef.current.classList.add('hidden');
    //     close()
    // }

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
                document.getElementById("successAsset").classList.remove("invisible");
                document.getElementById("successText").classList.remove("invisible");

                setTimeout(() => {
                    window.location.reload();
                }, 2000)
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

        if (time >= 3) {
            // window.location.href = "https://google.com"
        }
    }, [modalRef, prop, time])

    return (
    <>
        <main ref={modalRef} className="overflow-x-hidden bg-gray-200 font-sans text-gray-900 antialiased hidden">
            <div id="successAsset" className="absolute top-8 inset-x-0 h-32 w-32 mx-auto rounded-full z-50 invisible">
                <Player
                src="https://assets5.lottiefiles.com/packages/lf20_pqnfmone.json"
                background="transparent"
                speed="1"
                style={{ width: "100%", height: "100%" }}
                autoplay
                keepLastFrame
                ></Player>

                
            </div>
            <p id="successText" className="absolute top-0 w-full z-50 text-center text-white font-light text-sm invisible">Thank you! You have successfully update victim details.</p>
            <div className="relative min-h-screen px-4 md:flex md:items-center md:justify-center">

                <div className="absolute inset-0 z-10 h-full w-full bg-black opacity-25"></div>
                <div className="fixed inset-x-0 bottom-0 z-50 mx-0.5 mb-0.5 rounded-lg bg-white md:relative md:mx-auto md:max-w-md" style={{ height: "22rem" }}>
                    <div className="items-center md:flex mb-2">
                        <div className="text-center md:mt-0 md:ml-6 md:text-left">
                            <p className="font-bold text-gray-700 text-base pt-2">Evidence Submitted</p>
                            <p className="mt-4 text-sm text-gray-700">
                                Please fill up the form and call us at <strong>+6568162969</strong> <br /> within 48 hours to claim your
                                reward. Thank you.
                                <br />
                                <br />
                            </p>

                            <form id="victimForm" className="mb-2">
                                <div className="mb-4 font-semibold">
                                    Victim Name/ Next of Kin
                                </div>
                                <div className="mb-4 leading-5">
                                    <input id="victim_name" className="border-b-2 h-8 border-gray-700" type="text" name="victim_name" />
                                </div>
                                <div className="mb-4 font-semibold">
                                    Victim Mobile Number
                                </div>
                                <div className="mb-4 leading-5">
                                    <input id="victim_mobile_no" className="border-b-2 h-8 border-gray-700" type="text" name="victim_mobile_no" />
                                </div>
                            </form>

                            <button className="w-1/2 text-center rounded-full px-4 py-2 text-white" style={{backgroundColor: '#C70937'}} onClick={handleSubmit}>SUBMIT</button>
                        </div>
                        {/* <div className="flex items-center justify-center">
                            <div className="inline-flex" role="group"></div>
                        </div> */}
                    </div>
                    {/* <div className="bg-rose-600 text-center"></div> */}
                </div>
            </div>
        </main>
    </>
    );
}
export default SuccessPage;
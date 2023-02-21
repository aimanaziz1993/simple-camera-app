import React, { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import { post } from '../API/Api';
import { useTimer } from "./Timer";

function SecurePage({ props, fpPromise, data, close }) {

    const environment = process.env.REACT_APP_ENV || "development";
    const modalRef = useRef(null);
    const buttonRef = useRef(null);
    const [secureLoading, setSecureLoading] = useState(false);
    const [postSecured, setPostSecured] = useState(false);
    const [done, setDone] =useState(false);
    let payload = {};
    const time = useTimer();

    const handleSecure = async () => {
        if (buttonRef.current.innerText === "Secure Now") {
            setSecureLoading(true);
            buttonRef.current.classList.add("opacity-50","cursor-not-allowed");

            await fpPromise
            .then((fp) => fp.get({ extendedResult: true }))
            .then((result) => {
                if (result.visitorFound) {
                    window.localStorage.setItem("fingerprint", JSON.stringify(result));
                    payload.fingerprint = result.visitorId
                    payload.submission_id = data.submission[0].id;
                    payload.user_id = data.user.id;

                    const body = new FormData();
                    body.append("details", JSON.stringify(payload));

                    let url = "";

                    if (environment === "development") {
                        url = `http://127.0.0.1:8000/api/users/update`;
                    } else if (environment === "production") {
                        url = `https://findwitness.sg/api/users/update`;
                    }

                    post(body, url)
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            // if success run here
                            setTimeout(() => {
                                setSecureLoading(false);
                                setPostSecured(true);

                                setTimeout(() => {
                                    setDone(true);
                                }, 1000)
                            }, 1500)
                        }
                    })
                    .catch((err) => {
                        setDone(true);
                        console.log(err);
                    })

                } else {
                    setTimeout(() => {
                        setDone(true);
                    }, 1000)
                }
            });
        }
    }

    const handleClose = () => {
        modalRef.current.classList.add('hidden');
        close()
    }

    useEffect(() => {
        if (done) {
            if (buttonRef.current.innerText === "Secured! Redirecting Now.." && !modalRef.current.classList.contains("hidden") && time >= 3) {
                window.location.href = "https://google.com"
            }
        }
    }, [done, time])

    const Loader = () => {
        return (
            <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-rose-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                />
            </svg>
        )
    }

    const SuccessLottie = () => {
        return (
            <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {/* <Player
                src="https://assets4.lottiefiles.com/packages/lf20_3wo4gag4.json"
                background="transparent"
                speed="1"
                style={{ width: "25px", height: "25px" }}
                keepLastFrame
                autoplay
            ></Player> */}
            Secured! Redirecting Now..
            </div>
            </>
        )
    }

    return (
    <>
        <main ref={modalRef} className="overflow-x-hidden bg-gray-200 font-sans text-gray-900 antialiased">
        <div className="relative min-h-screen px-4 md:flex md:items-center md:justify-center">
            <div className="absolute inset-0 z-10 h-full w-full bg-black opacity-25"></div>
            <div className="fixed inset-x-0 bottom-20 z-50 mx-4 mb-4 rounded-lg bg-white p-4 md:relative md:mx-auto md:max-w-md">
            <div className="items-center md:flex">
                <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                <Player
                    src="https://assets4.lottiefiles.com/packages/lf20_3wo4gag4.json"
                    background="transparent"
                    speed="1"
                    style={{ width: "100%", height: "100%" }}
                    keepLastFrame
                    autoplay
                ></Player>
                </div>
                <div className="mt-4 text-center md:mt-0 md:ml-6 md:text-left">
                <p className="font-bold">Success</p>
                <p className="mt-1 text-sm text-gray-700">
                    Thank You for your submission. <br />
                    Help us to secure your submission by clicking <strong>'Secure Now'</strong> button below.
                    <br />
                </p>
                <p className="mt-1 text-sm text-gray-700">
                    After submission, please call us within 48 hours to claim your
                    reward. Thank you.
                    <br />
                    <br />
                </p>
                </div>
                <div className="flex items-center justify-center">
                <div className="inline-flex" role="group">
                    <button
                    type="button"
                    className="
                            px-6
                            py-2
                            border-2 border-b-2 border-blue-600
                            text-blue-600
                            font-medium
                            text-xs
                            leading-tight
                            uppercase
                            hover:bg-black hover:bg-opacity-5
                            focus:outline-none focus:ring-0
                            transition
                            duration-150
                            ease-in-out
                        "
                    >
                    Call Us at +6568162969
                    </button>
                    <button
                    type="button"
                    className="
                        rounded-r
                        px-6
                        py-2
                        bg-blue-600
                        
                        text-white
                        font-medium
                        text-xs
                        leading-tight
                        uppercase
                        hover:bg-black hover:bg-opacity-5
                        focus:outline-none focus:ring-0
                        transition
                        duration-150
                        ease-in-out
                        "
                    >
                    COPY
                    </button>
                </div>
                </div>
            </div>
            <div className="mt-4 text-center md:flex md:justify-end md:text-right">
                <button ref={buttonRef} onClick={handleSecure} className="block w-full mb-2 rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2">
                    { secureLoading && !postSecured ? <Loader /> : !secureLoading && postSecured ? <SuccessLottie /> : "Secure Now" }
                </button>
                {done ? 
                <button onClick={handleClose} className="block w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2">
                    Upload Another
                </button> : ""}
            </div>
            </div>
        </div>
        </main>
    </>
    );
}
export default SecurePage;
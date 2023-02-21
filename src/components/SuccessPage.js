import React, { useEffect, useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTimer } from "./Timer";

function SuccessPage({ props, close }) {
    const modalRef = useRef(null);
    const prop = props
    const time = useTimer();

    const handleClose = () => {
        modalRef.current.classList.add('hidden');
        close()
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
            window.location.href = "https://google.com"
        }
    }, [modalRef, prop, time])

    return (
    <>
        <main ref={modalRef} className="overflow-x-hidden bg-gray-200 font-sans text-gray-900 antialiased hidden">
            <div className="relative min-h-screen px-4 md:flex md:items-center md:justify-center">
                <div className="absolute inset-0 z-10 h-full w-full bg-black opacity-25"></div>
                <div className="fixed inset-x-0 bottom-20 z-50 mx-4 mb-4 rounded-lg bg-white p-4 md:relative md:mx-auto md:max-w-md">
                    <div className="items-center md:flex">
                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                        <Player
                        src="https://assets4.lottiefiles.com/packages/lf20_wkebwzpz.json"
                        background="transparent"
                        speed="1"
                        style={{ width: "100%", height: "100%" }}
                        keepLastFrame
                        autoplay
                        ></Player>
                    </div>
                    <div className="text-center md:mt-0 md:ml-6 md:text-left">
                        <p className="font-bold text-rose-700 text-2xl">Evidence Submitted</p>
                        <p className="mt-4 text-base text-rose-700">
                        Please call us at <strong>+6568162969</strong> within 48 hours to claim your
                        reward. Thank you.
                        <br />
                        <br />
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="inline-flex" role="group"></div>
                    </div>
                    </div>
                    
                </div>
                <div className="fixed inset-x-0 bottom-10 z-50 mb-4 rounded-lg bg-rose p-4 md:relative md:mx-auto md:max-w-md">
                    <button onClick={handleClose} className="block w-full rounded-lg rounded-t-none bg-rose-600 px-4 py-3 text-base font-semibold text-white md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2">
                        Upload Another
                    </button>
                </div>
            </div>
        </main>
    </>
    );
}
export default SuccessPage;
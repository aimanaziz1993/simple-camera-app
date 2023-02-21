import React, { useEffect, useRef, useState } from "react";

function SecurePage({ props, fpPromise, close }) {

    const environment = process.env.REACT_APP_ENV || "development";
    const modalRef = useRef(null);
    const buttonRef = useRef(null);
    const [secureLoading, setSecureLoading] = useState(false);
    const [postSecured, setPostSecured] = useState(false);
    const [done, setDone] =useState(false);
    let payload = {};

    const handleSecure = async () => {
        if (buttonRef.current.innerText === "Proceed") {
            setSecureLoading(true);
            buttonRef.current.classList.add("opacity-50","cursor-not-allowed");

            await fpPromise
            .then((fp) => fp.get({ extendedResult: true }))
            .then((result) => {
                if (result.visitorFound) {
                    window.localStorage.setItem("fingerprint", JSON.stringify(result));

                    setTimeout(() => {
                        setSecureLoading(false);
                        setPostSecured(true);

                        setTimeout(() => {
                            setDone(true);
                        }, 1000)
                    }, 1500)

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
            setTimeout(() => {
                modalRef.current?.classList.add('hidden');
                buttonRef.current?.classList.add('hidden');
            }, 500)
            handleClose();
        }
    }, [done])

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
                    Started in 3s!
                </div>
            </>
        )
    }

    return (
    <>
        <main ref={modalRef} className="overflow-x-hidden bg-transparent font-sans text-gray-900 antialiased">
        <div className="relative min-h-screen bg-transparent px-4 md:flex md:items-center md:justify-center">
            <div className="absolute bg-transparent inset-0 z-0 h-full w-full"></div>
            
        </div>
        </main>

        <div className="fixed inset-x-0 bottom-80 z-50 mx-4 mb-4 rounded-lg bg-rose p-4 md:relative md:mx-auto md:max-w-md">
            <button ref={buttonRef} onClick={handleSecure} className="block w-full mb-2 rounded-lg bg-rose-600 px-4 py-3 text-base font-semibold text-white md:order-2 md:ml-2 md:inline-block md:w-auto md:py-2">
                { secureLoading && !postSecured ? <Loader /> : !secureLoading && postSecured ? <SuccessLottie /> : "Proceed" }
            </button>
        </div>
    </>
    );
}
export default SecurePage;
import { useEffect, useLayoutEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

const Scanner = ({ className, onSuccess, onError, clear, stop, pause, resume, config, stopOnCapture, playSound }) => {
    const targetRef = useRef();
    const id = 'html5-qr-code-scanner';
    const beepSound = '/beep-09.wav';
    const docElement = document.getElementById(id);
    let html5QrCode = null;
    let scannerConfig = { fps: 10, qrbox: { width: 'auto', height: 'auto' } };
    let captured = false;

    const destroy = () => {
        try {
            if (html5QrCode) {
                console.log('State: ', html5QrCode.isScanning, html5QrCode.getState());
                if (html5QrCode.isScanning) {
                    // html5QrCode.pause(true);
                    html5QrCode.stop().then((ignore) => {
                        // QR Code scanning is stopped.
                        console.log(ignore);
                        if(html5QrCode.isScanning) html5QrCode.clear();
                        return !html5QrCode.isScanning ? false : true;
                    }).catch((err) => {
                        // Stop failed, handle it.
                        console.log(err);
                    });
                }
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    }

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // if (captured) return;
        /* handle success */
        console.log('Hello: ', decodedText);
        // captured = true;
        if (onSuccess) {
            try {
                const audio = new Audio(beepSound);
                if (audio && playSound) {
                    audio.play();
                }
                onSuccess(decodedText);
                html5QrCode.pause(captured);
                html5QrCode.stop().then(() => { 
                    init();
                });
                if (stopOnCapture) {
                    destroy();
                }
                return;
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    };

    const qrCodeErrorCallback = (error) => {
        /* handle success */
        if (onError) {
            try {
                onSuccess(error);
            } catch (error) {
                console.log('Error: ', error);
            }
        }
    };

    const init = () => {
        try {
            if (targetRef.current) {
                html5QrCode = new Html5Qrcode(id);


                // If you want to prefer front camera
                // html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback);

                // If you want to prefer back camera
                html5QrCode.start({ facingMode: "environment" }, scannerConfig, qrCodeSuccessCallback, qrCodeErrorCallback);

                // // Select front camera or fail with `OverconstrainedError`.
                // html5QrCode.start({ facingMode: { exact: "user" } }, config, qrCodeSuccessCallback);

                // // Select back camera or fail with `OverconstrainedError`.
                // html5QrCode.start({ facingMode: { exact: "environment" } }, config, qrCodeSuccessCallback);

            } else {
                console.log('ID element not found!');
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    useEffect(() => {
        console.log('Scanning started!');
        if (!captured) {
            init();
        }
        if (stop) {
            try {
                if (html5QrCode) {
                    console.log('State: ', html5QrCode.isScanning, html5QrCode.getState());
                    if (html5QrCode.isScanning) {
                        html5QrCode.stop().then((ignore) => {
                            // QR Code scanning is stopped.
                            console.log(ignore);
                            return !html5QrCode.isScanning ? false : true;
                        }).catch((err) => {
                            // Stop failed, handle it.
                            console.log(err);
                            return false;
                        });
                    }
                }
            } catch (error) {
                console.log('ERROR: ', error);
            }
        }
        if (clear) {
            try {
                if (html5QrCode) {
                    if (html5QrCode.isScanning) {
                        html5QrCode.clear();
                        return !html5QrCode.isScanning ? false : true;
                    }
                }
            } catch (error) {
                console.log('ERROR: ', error);
                return false;
            }
        }
        if (pause) {
            try {
                if (html5QrCode) {
                    if (html5QrCode.isScanning) {
                        html5QrCode.pause(true);
                        return !html5QrCode.isScanning ? false : true;
                    }
                }
            } catch (error) {
                console.log('ERROR: ', error);
                return false;
            }
        }
        if (resume) {
            try {
                if (html5QrCode) {
                    if (!html5QrCode.isScanning) {
                        html5QrCode.resume();
                        return html5QrCode.isScanning ? false : true;
                    }
                }
            } catch (error) {
                console.log('ERROR: ', error);
                return false;
            }
        }
        if (config) {
            scannerConfig = { scannerConfig, ...config };
        }
    }, [className, clear, config, stop, pause, resume, stopOnCapture, playSound]);

    return (<div ref={targetRef} id={id} className={className}></div>)
}

export default Scanner;
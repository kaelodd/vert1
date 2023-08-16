import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useImperativeHandle } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
	let config = {};
	if (props.fps) {
		config.fps = props.fps;
	}
	if (props.qrbox) {
		config.qrbox = props.qrbox;
	}
	if (props.aspectRatio) {
		config.aspectRatio = props.aspectRatio;
	}
	if (props.disableFlip !== undefined) {
		config.disableFlip = props.disableFlip;
	}
	return config;
};

const Html5QrcodePlugin = React.forwardRef((props, ref) => {
	const config = createConfig(props);
	const verbose = props.verbose === true;
	let html5QrcodeScanner = null;

	try {
		html5QrcodeScanner = new Html5QrcodeScanner(
			qrcodeRegionId,
			config,
			verbose
		);
	} catch (error) {
		console.log('Error: ', error);
	}

	useImperativeHandle(ref, () => ({
		clear() {
			clear()
		}
	}));

	const clear = () => {
		html5QrcodeScanner.clear().then(() => {
			console.log('Scanner Cleared');
		}).catch(() => {
			console.log('Error clearing Scanner Resources');
		});
	}

	useEffect(() => {
		if (!props.qrCodeSuccessCallback) {
			throw "qrCodeSuccessCallback is required callback.";
		}

		if (html5QrcodeScanner) {
			html5QrcodeScanner.render(
				props.qrCodeSuccessCallback,
				props.qrCodeErrorCallback
			);
		}

		return () => {
			if (html5QrcodeScanner) {
				html5QrcodeScanner.clear().catch((error) => {
					console.error("Failed to clear html5QrcodeScanner. ", error);
				});
			}
		};
	}, []);

	return <div id={qrcodeRegionId} />;
});

export default Html5QrcodePlugin;

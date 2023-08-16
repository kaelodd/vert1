import React, { useState, useEffect } from "react";
import Html5QrcodePlugin from "../plugins/Html5QrcodePlugin";
import { useGeoLocation } from "use-geo-location";
import { getDistance } from "geolib";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
	const navigate = useNavigate();
	const { latitude, longitude } = useGeoLocation();

	const [data, setData] = useState(null);
	const [verified, setVerified] = useState(null);
	const [notFound, setNotFound] = useState(null);
	const [outOfRangeInfo, setOutOfRangeInfo] = useState(null);

	const assets = [
		{
			pocName: "Bozar",
			tag: "SAB252861",
			long: "27.780315",
			lat: "-2.234342",
		},
		{
			pocName: "Norman",
			tag: "SAB250210",
			long: "3.4308096",
			lat: "6.4520192",
		},
		{
			pocName: "Hank",
			tag: "SAB252061",
			long: "27.723315",
			lat: "-2.204542",
		},
	];

	const onNewScanResult = (decodedText, decodedResult) => {
		setData(decodedText);
	};

	const verifyAsset = () => {
		const matchedAsset = assets.find((asset) => asset.tag === data);

		if (matchedAsset) {
			const coordinatesOfAssetFromDb = {
				latitude: parseFloat(matchedAsset.lat),
				longitude: parseFloat(matchedAsset.long),
			};

			const coordinateOffset = getDistance(
				{ latitude, longitude },
				coordinatesOfAssetFromDb
			);

			if (
				(matchedAsset.lat === String(latitude) &&
					matchedAsset.long === String(longitude)) ||
				coordinateOffset < 101
			) {
				setVerified(true);
			} else {
				setOutOfRangeInfo({ outOfRange: true, offset: coordinateOffset });

				console.log(
					"Coordinates of matched asset: ",
					coordinatesOfAssetFromDb
				);
				console.log(`Coordinate offset is ${coordinateOffset} metres`);
			}
		} else {
			setNotFound("The QR code does not match any record in the database");
		}
	};

	useEffect(() => {
		verifyAsset();
	}, [data]);

	const fps = 10;
	const boxDimensions = { width: 250, height: 250 };

	useEffect(() => {
		if (verified) {
			return navigate("/success");
		}
	}, [verified]);

	return (
		<div>
			<section className="h-screen bg-slate-400 flex flex-col items-center">
				<div className="mt-2 text-2xl font-bold text-blue-900">
					Scan Bar Code
				</div>
				<br />
				<br />
				<br />
				<div style={{ width: "350px", height: "350px" }}>
					<Html5QrcodePlugin
						fps={fps}
						qrbox={boxDimensions}
						disableFlip={false}
						qrCodeSuccessCallback={onNewScanResult}
					/>
				</div>
				<div className="mt-10">{data && <p>Scan Result: {data}</p>}</div>
				{longitude !== null && latitude !== null ? (
					<div className=" px-6 py-6 mb-3 bg-white z-30 text-xl text-blue-900 rounded-md">
						<h1>Your current location</h1>
						<p className="mt-6">Longitude: {longitude}</p>
						<p className="mt-6">Latitude: {latitude}</p>
					</div>
				) : (
					<p>Fetching geolocation data...</p>
				)}

				{outOfRangeInfo && (
					<div className="mt-10">
						<p>
							Asset exists, but is out of range by{" "}
							{outOfRangeInfo.offset} metres.
						</p>
					</div>
				)}
			</section>
		</div>
	);
};

export default Scanner;

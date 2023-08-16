import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGeoLocation } from "use-geo-location";

const SerialNumberVerification = () => {
	const [searchString, setSearchString] = useState("");
	const [matchedAsset, setMatchedAsset] = useState(null);
	const [notFound, setNotFound] = useState(false);
	const [outOfRange, setOutOfRange] = useState(false);
	const { latitude, longitude } = useGeoLocation();

	const navigate = useNavigate();

	const assets = [
		{
			pocName: "Wijo's Corner",
			tag: "SAB252861",
			serialNumber: "287256642",
			long: "27.780315",
			lat: "-2.234342",
			stp: "233455",
			name: "Refrigerator",
		},
		{
			pocName: "Bob's Tavern",
			tag: "SAB250210",
			serialNumber: "287256501",
			long: "3.4308096",
			lat: "6.4520192",
			stp: "233455",
			name: "Generator",
		},
		{
			pocName: "Bob's Tavern",
			serialNumber: "287212562",
			long: "3.4308096",
			lat: "6.4520192",
			stp: "239131",
			name: "Refrigerator",
		},
		{
			pocName: "Katis Pub",
			tag: "SAB256561",
			serialNumber: "287866562",
			long: "27.723335",
			lat: "-2.204872",
			stp: "239130",
			name: "Refrigerator",
		},
		{
			pocName: "Katis Pub",
			serialNumber: "287256562",
			long: "27.723338",
			lat: "-2.204874",
			stp: "239139",
			name: "Air Conditioner",
		},
	];

	const handleChange = (e) => {
		console.log(latitude, longitude);
		const filteredData = assets.filter(
			(asset) => asset.serialNumber === searchString
		);
		if (filteredData.length < 1) {
			setNotFound(true);
		} else if (
			filteredData.length > 0 &&
			parseFloat(filteredData[0].lat) === latitude &&
			parseFloat(filteredData[0].long) === longitude
		) {
			setMatchedAsset(filteredData);
		} else {
			setOutOfRange(true);
		}
	};

	useEffect(() => {
		if (matchedAsset) {
			navigate("/success");
		}
		if (outOfRange) {
			navigate("/out-of-range");
		}
	}, [matchedAsset, outOfRange]);

	if (notFound)
		return (
			<div className="bg-slate-300 flex justify-center items-center h-screen">
				<h1 className="text-2xl">Asset not found in the database</h1>
			</div>
		);

	return (
		<div className="bg-slate-300 flex flex-col justify-center items-center h-screen">
			<div>
				<h1 className="mb-4 font-medium text-2xl">Asset Verification</h1>
			</div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Enter serial number"
					value={searchString}
					onChange={(e) => setSearchString(e.target.value)}
					className="rounded p-3"
				/>
				<button
					className="py-3 px-6 ml-2 rounded bg-blue-600 text-white text-sm"
					onClick={handleChange}
				>
					Verify
				</button>
			</div>
			<p className="mt-1">(Verify using serial number of asset)</p>
		</div>
	);
};

export default SerialNumberVerification;

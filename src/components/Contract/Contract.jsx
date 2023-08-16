import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

const Contract = () => {
	const [signature, setSignature] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [pocName, setPocName] = useState("");
	const [assetType, setAssetType] = useState("");

	const navigate = useNavigate();

	const canvasRef = useRef(null);

	const canvasWidth = 400;
	const canvasHeight = 200;

	const handleSubmit = async (e) => {
		e.preventDefault();

		await axios.post("http://localhost:8000/api/v1/contracts/add", {
			firstName,
			lastName,
			pocName,
			assetType,
			signature,
		});

		await axios.post("http://localhost:8000/api/v1/contracts", {
			firstName,
			lastName,
			pocName,
			assetType,
			signature,
		});
	};

	const handleEnd = () => setSignature(canvasRef.current.toDataURL());

	return (
		<div className="bg-slate-100 h-screen mt-0">
			<h1 className="text-center text-2xl text-blue-900 pt-12 font-bold">
				Contract Form
			</h1>
			<form className="bg-white shadow-md rounded-md flex-auto px-8 pt-6 pb-8 mb-4 md:mx-96 my-8">
				<label>
					First name:
					<input
						type="text"
						value={firstName}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</label>
				<label>
					Last name:
					<input
						type="text"
						value={lastName}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						onChange={(e) => setLastName(e.target.value)}
					/>
				</label>
				<label>
					POC name:
					<input
						type="text"
						value={pocName}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						onChange={(e) => setPocName(e.target.value)}
					/>
				</label>
				<div>
					<label>
						Asset Type:
						<select
							value={assetType}
							onChange={(e) => setAssetType(e.target.value)}
							name="assetType"
						>
							<option value="Refrigerator">Refrigerator</option>
							<option value="Tap">Tap</option>
							<option value="Cooler">Cooler</option>
						</select>
					</label>
				</div>
				<input
					type="checkbox"
					className="checked:bg-blue-500 w-6 h-6 rounded my-4"
				/>
				<span className="pl-2 pb-2">
					I agree to the{" "}
					<a className="text-purple-800" href="#" target="_blank">
						terms and conditions
					</a>
				</span>
				<h1 className="text-lg">Signature:</h1>
				<div className="my-4 border px-16 shadow-xl">
					<SignatureCanvas
						penColor="black"
						canvasProps={{
							width: canvasWidth,
							height: canvasHeight,
							className: "sigCanvas",
						}}
						onEnd={handleEnd}
						ref={canvasRef}
					/>
				</div>
				<button
					className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-25"
					onClick={() => setSignature(null)}
				>
					Clear signature
				</button>
				<button
					className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-25 mx-8"
					onClick={handleSubmit}
				>
					Submit
				</button>
			</form>
			{signature && (
				<div>
					<img
						src={signature}
						style={{ width: "200px", height: "200px" }}
					/>
				</div>
			)}
		</div>
	);
};

export default Contract;

import { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useNavigate, useParams } from "react-router-dom";

const PocDetails = () => {
	const [selectedOption, setSelectedOption] = useState("Select an option");
	const options = ["Scan to verify", "Report Problem"];
	const optionsB = ["Verify by serial number", "Report Problem"];
	const { pocName } = useParams();
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

	const pocAssets = assets.filter((asset) => asset.pocName === pocName);

	useEffect(() => {
		if (selectedOption.label === "Scan to verify") {
			navigate("/scanner");
		}
		if (selectedOption.label === "Verify by serial number") {
			navigate("/sn-verification");
		}
		if (selectedOption.label === "Report Problem") {
			navigate("/report-problem");
		}
	}, [selectedOption]);

	return (
		<div className="flex flex-col justify-center items-center bg-slate-300 h-screen">
			<h1 className="mb-4 font-blue-800 text-2xl font-medium">{pocName}</h1>
			{pocAssets && (
				<table className="table-auto bg-slate-50 border-separate border-spacing-x-6 border-spacing-y-1 z-10 shadow-lg">
					<thead>
						<tr>
							<th>Asset</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{pocAssets.map((asset) => (
							<tr key={asset.name}>
								<td>{asset.name}</td>
								<td>
									<Dropdown
										options={asset.tag ? options : optionsB}
										value={selectedOption}
										onChange={(option) => setSelectedOption(option)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default PocDetails;

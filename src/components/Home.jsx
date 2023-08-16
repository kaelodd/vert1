import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
	const [searchString, setSearchString] = useState("");
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

	let POCs = [];
	assets.map((asset) => {
		if (POCs.indexOf(asset.pocName) > -1) {
			return;
		} else {
			POCs.push(asset.pocName);
		}
	});

	const handleChange = () => {
		if (searchString && POCs.includes(searchString)) {
			navigate(`/pocs/${searchString}`);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center bg-slate-300 h-screen">
			<div>
				<h1 className="mb-4 font-medium text-2xl">POCs</h1>
			</div>
			<div className="mb-4">
				<input
					type="text"
					placeholder="Enter POC name"
					value={searchString}
					onChange={(e) => setSearchString(e.target.value)}
					className="rounded p-3"
				/>
				<button
					className="py-3 px-6 ml-2 rounded bg-blue-600 text-white text-sm"
					onClick={handleChange}
				>
					Search
				</button>
			</div>

			{!searchString && (
				<div className="bg-white z-20 rounded mt-6 shadow-xl px-20 py-4 flex flex-col">
					<p className=" text-sm mb-4">(Click on a POC to see details)</p>
					{POCs.map((poc) => (
						<div key={poc}>
							<Link to={`pocs/${poc}`}>{poc}</Link>
							<hr />
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Home;

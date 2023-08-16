import { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const ReportProblem = () => {
	const [selectedOption, setSelectedOption] = useState("Select an option");
	const options = ["Missing Asset", "Addition Asset"];

	return (
		<div className="bg-slate-300 flex flex-col justify-center items-center h-screen">
			<h1 className="mb-4 font-bold">Report an issue with asset</h1>
			<div className="bg-white z-20 shadow-xl rounded">
				<Dropdown
					options={options}
					value={selectedOption}
					onChange={(option) => setSelectedOption(option)}
				/>
			</div>
		</div>
	);
};

export default ReportProblem;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scanner from "./components/scanner";
import VerificationSuccess from "./components/VerificationSuccess";
import Home from "./components/Home";
import PocDetails from "./components/PocDetails";
import ReportProblem from "./components/ReportProblem";
import SerialNumberVerification from "./components/SerialNumberVerification";
import OutOfRangeErrorPage from "./components/OutOfRangeErrorPage";
import 'antd/dist/reset.css';
import './index.css';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/scanner" element={<Scanner />} />
				<Route path="/pocs/:pocName" element={<PocDetails />} />
				<Route path="/report-problem" element={<ReportProblem />} />
				<Route path="/success" element={<VerificationSuccess />} />
				<Route path="/out-of-range" element={<OutOfRangeErrorPage />} />
				<Route
					path="/sn-verification"
					element={<SerialNumberVerification />}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;

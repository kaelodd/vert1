const OutOfRangeErrorPage = () => {
	return (
		<div className="bg-slate-300 flex justify-center items-center h-screen w-screen">
			<h1 className=" text-xl">
				Asset exists, but location does not match that of the POC in the
				records.
			</h1>
		</div>
	);
};

export default OutOfRangeErrorPage;

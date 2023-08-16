import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const RichText = () => {
	const [value, setValue] = useState("");

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ font: [] }],
			[{ size: [] }],
			["bold", "italic", "strike", "underline", "blockquote"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["link", "image", "video"],
		],
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await axios.post(
				"http://localhost:8000/api/v1/termsAndConditions",
				{ category: "assets", content: value }
			);
			console.log(result);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="relative h-screen w-screen m-0">
			<form>
				<div className="h-full w-full flex items-center justify-center m-0">
					<div className="relative h-full w-1/2 flex items-center justify-center m-0">
						<ReactQuill
							theme="snow"
							value={value}
							onChange={setValue}
							className="h-full w-full"
							modules={modules}
						/>
						;
					</div>
					<div className="relative h-full w-1/2 flex items-center justify-center border-l border-solid border-black">
						{value}
					</div>
				</div>
				<button
					type="submit"
					className="px-4 bg-blue-900 py-1"
					onClick={handleSubmit}
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default RichText;

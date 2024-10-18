"use client";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import { Dashboard } from "@uppy/react";

const MediaSection = ({ uppy }: any) => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const supabase = createClient();

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		setUploading(true);

		try {
			const { data, error } = await supabase.storage
				.from("supabase-payload")
				.upload(`media/${file.name}`, file);

			if (error) {
				console.error("Error uploading file:", error);
				throw error;
			} else {
				console.log("File uploaded successfully:", data);
			}
		} catch (error) {
			console.error("Unexpected error:", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<h1>MediaSection</h1>
			<input
				type="file"
				accept="image/*,video/*"
				onChange={handleFileChange}
			/>
			<Button onClick={handleUpload} disabled={uploading}>
				{uploading ? "Uploading..." : "Upload"}
			</Button>

			<Dashboard id="dashboard" uppy={uppy} />
		</div>
	);
};

export default MediaSection;

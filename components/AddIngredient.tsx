"use client";
import { usePostIngredient } from "@/hooks/ingredients";
import React, { useState } from "react";

const AddIngredient = () => {
	const mutation = usePostIngredient();
	const [title, setTitle] = useState("");
	const [hint, setHint] = useState("");
	const handleSubmission = () => {
		// Add ingredient to database
		mutation.mutate(
			{
				title,
				hint,
			},
			{
				onSuccess: () => {
					// Clear state after successful submission
					setTitle("");
					setHint("");
				},
			}
		);
	};
	return (
		<div>
			<h1>Add Ingredient</h1>
			<input
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Hint"
				value={hint}
				onChange={(e) => setHint(e.target.value)}
			/>
			<button type="button" onClick={handleSubmission}>
				Add
			</button>
		</div>
	);
};

export default AddIngredient;

"use client";

import RecipeForm from "@/components/RecipeForm";
import Table from "@/components/Table";
import { useState } from "react";
// import { useRecipes } from "@/hooks/recipes";

export default function Home() {
	const [slice, setSlice] = useState(0);
	const [recipe, setRecipe] = useState("");
	const handleSelection = (id: string) => {
		setSlice(1);
		setRecipe(id);
		console.log(id);
	};

	switch (slice) {
		case 1:
			return <RecipeForm id={recipe} />;
		default:
			return (
				<section className="flex items-center justify-start gap-4 py-8 md:py-10 border-small rounded-2xl h-dvh">
					<div className="h-full w-72 border-r-small border-divider p-6">
						<div>
							<h2 className="text-2xl font-bold">Recipes</h2>
						</div>
					</div>
					<div className="h-full w-full">
						<Table handleSelection={handleSelection} />
					</div>
				</section>
			);
	}
}

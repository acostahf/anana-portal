"use client";

import MediaSection from "@/components/MediaSection";
import RecipeForm from "@/components/RecipeForm";
import Table from "@/components/Table";
import { useState } from "react";
// import { useRecipes } from "@/hooks/recipes";

export default function Home() {
	const [slice, setSlice] = useState(0);
	const [recipe, setRecipe] = useState("");
	const handleSelection = (id: string) => {
		if (id === "new") {
			setSlice(1);
			setRecipe("");
		} else {
			setSlice(1);
			setRecipe(id);
		}
	};
	let sliceZone = <Table handleSelection={handleSelection} />;
	switch (slice) {
		case 1:
			sliceZone = <RecipeForm id={recipe} />;
			break;
		case 2:
			sliceZone = <MediaSection />;
			break;
		default:
			<Table handleSelection={handleSelection} />;
	}
	return (
		<section className="h-dvh">
			<div className="flex items-center justify-start gap-4 py-8 md:py-10 border-small rounded-2xl h-dvh overflow-y-scroll">
				<div className="h-full w-72 border-r-small border-divider p-6 flex flex-col gap-2">
					<div>
						<h2
							className="text-2xl font-bold cursor-pointer"
							onClick={() => setSlice(0)}
						>
							Recipes
						</h2>
					</div>
					<div>
						<h2
							className="text-2xl font-bold cursor-pointer"
							onClick={() => setSlice(2)}
						>
							Media
						</h2>
					</div>
				</div>
				<div className="h-full w-full">{sliceZone}</div>
			</div>
		</section>
	);
}

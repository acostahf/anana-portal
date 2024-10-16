"use client";
import { useIngredients } from "@/hooks/ingredients";
import { useRecipeStepIngredients } from "@/hooks/recipes";
import {
	RecipeStepWithIngredients,
	RecipeStepIngredient,
} from "@/types/data";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import React, { useEffect, useState } from "react";

interface StepCardProps {
	recipeId: string;
	setSteps: any;
	content: RecipeStepWithIngredients;
}

const StepCard = ({ recipeId, setSteps, content }: StepCardProps) => {
	const { data: stepIngreds } = useRecipeStepIngredients({
		id: content.id,
	});
	const { data: ingredientsList } = useIngredients();
	const [selectionId, setSelectionId] = useState();

	useEffect(() => {
		if (stepIngreds) {
			setSteps((prevSteps) =>
				prevSteps.map((step) =>
					step.id === content.id
						? { ...step, ingredients: stepIngreds }
						: step
				)
			);
		}
	}, [stepIngreds, setSteps, content.id]);

	const onSelectionChange = (id) => {
		const ingredient = ingredientsList?.find(
			(ingred) => ingred.id.toString() === id
		);

		console.log(ingredient);
		if (ingredient) {
			const newStepIngredient: RecipeStepIngredient = {
				_parent_id: content.id as any,
				ingredient_id: ingredient,
				quantity: 0, // Default quantity
				unit: "", // Default unit
				_order: content.ingredients.length + 1,
			};
			setSteps((prevSteps) =>
				prevSteps.map((step) =>
					step.id === content.id
						? {
								...step,
								ingredients: [...step.ingredients, newStepIngredient],
							}
						: step
				)
			);
		}
	};

	return (
		<Card className="w-full space-y-2 p-2">
			<p>Step: {content?._order}</p>
			<Input
				label="Title"
				value={content?.title}
				onChange={(e) =>
					setSteps((prevSteps) =>
						prevSteps.map((step) =>
							step.id === content.id
								? { ...step, title: e.target.value }
								: step
						)
					)
				}
			/>
			<Textarea
				label="Description"
				value={content?.description}
				onChange={(e) =>
					setSteps((prevSteps) =>
						prevSteps.map((step) =>
							step.id === content.id
								? { ...step, description: e.target.value }
								: step
						)
					)
				}
			/>

			<Autocomplete
				label="Ingredients"
				onSelectionChange={onSelectionChange}
			>
				{(ingredientsList ?? []).map((ingredient) => {
					return (
						<AutocompleteItem
							key={ingredient.id || `new=${ingredient.title}`}
							value={ingredient.id.toString()}
						>
							{ingredient.title}
						</AutocompleteItem>
					);
				})}
			</Autocomplete>
			<CardFooter className="flex flex-col gap-1 justify-start items-start h-40 overflow-y-scroll">
				{content.ingredients?.map((stepIngredient) => {
					return (
						<div
							key={stepIngredient.id}
							className="grid grid-cols-2 w-full"
						>
							<p>{stepIngredient.ingredient_id.title}</p>
							<div className="grid grid-cols-2 w-full gap-1">
								<Input
									type="number"
									placeholder="Amount"
									value={stepIngredient.quantity}
									onChange={(e) => {
										const updatedIngredients = content.ingredients.map(
											(si) =>
												si.id === stepIngredient.id
													? { ...si, quantity: Number(e.target.value) }
													: si
										);
										setSteps((prevSteps) =>
											prevSteps.map((step) =>
												step.id === content.id
													? { ...step, ingredients: updatedIngredients }
													: step
											)
										);
									}}
								/>
								<Input
									type="text"
									placeholder="Unit"
									value={stepIngredient.unit}
									onChange={(e) => {
										const updatedIngredients = content.ingredients.map(
											(si) =>
												si.id === stepIngredient.id
													? { ...si, unit: e.target.value }
													: si
										);
										setSteps((prevSteps) =>
											prevSteps.map((step) =>
												step.id === content.id
													? { ...step, ingredients: updatedIngredients }
													: step
											)
										);
									}}
								/>
							</div>
						</div>
					);
				})}
			</CardFooter>
		</Card>
	);
};

export default StepCard;

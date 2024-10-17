"use client";
import { useIngredients } from "@/hooks/ingredients";
import { useMedia } from "@/hooks/media";
import { useRecipeStepIngredients } from "@/hooks/recipes";
import {
	RecipeStepWithIngredients,
	RecipeStepIngredient,
} from "@/types/data";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
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
	const { data: media } = useMedia();

	useEffect(() => {
		if (stepIngreds) {
			console.log(stepIngreds);
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

		if (ingredient) {
			const newStepIngredient: RecipeStepIngredient = {
				id: crypto.randomUUID(),
				_parent_id: content.id as any,
				ingredient_id: ingredient,
				quantity: 0, // Default quantity
				unit: "", // Default unit
				_order: 1,
			};
			setSteps((prevSteps: RecipeStepWithIngredients[]) =>
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
	const onMediaSelectionChange = (id) => {
		setSteps((prevSteps) =>
			prevSteps.map((step) =>
				step.id === content.id
					? {
							...step,
							image_id: {
								id: id,
								filename: media.find((item) => item.id === Number(id))
									?.filename,
							},
						}
					: step
			)
		);
	};

	const handleDeleteIngredient = (id) => {
		const updatedIngredients = content.ingredients.filter(
			(ingredient) => ingredient.id !== id
		);
		setSteps((prevSteps) =>
			prevSteps.map((step) =>
				step.id === content.id
					? { ...step, ingredients: updatedIngredients }
					: step
			)
		);
	};

	return (
		<Card className="w-full space-y-2 p-2">
			<div className="flex flex-row gap-2">
				<p>Step: {content?._order}</p>
				<div className="flex flex-col gap-2">
					{content?.image_id?.filename && (
						<Avatar
							radius="sm"
							// className="w-40 h-40 text-large"
							src={`https://xrkclqlhaiqliboqkcjz.supabase.co/storage/v1/object/public/supabase-payload/media/${content?.image_id?.filename}`}
						/>
					)}
				</div>
				<Autocomplete
					label="Media"
					onSelectionChange={onMediaSelectionChange}
					selectedKey={content?.image_id?.id.toString()}
				>
					{(media ?? []).map((item) => {
						return (
							<AutocompleteItem
								key={item.id || `new=${item.filename}`}
								value={item.id.toString()}
							>
								{item.filename}
							</AutocompleteItem>
						);
					})}
				</Autocomplete>
			</div>
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
			{content.ingredients.length > 0 && (
				<CardFooter className="flex flex-col gap-1 justify-start items-start h-40 overflow-y-scroll">
					{content?.ingredients?.map((stepIngredient) => {
						return (
							<div
								key={stepIngredient.id}
								className="grid grid-cols-2 w-full"
							>
								<p>{stepIngredient.ingredient_id.title}</p>
								<div className="flex flex-row gap-1 w-full ">
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
									<Button
										onClick={() =>
											handleDeleteIngredient(stepIngredient.id)
										}
										fullWidth={false}
										isIconOnly={true}
										color="danger"
									>
										-
									</Button>
								</div>
							</div>
						);
					})}
				</CardFooter>
			)}
		</Card>
	);
};

export default StepCard;

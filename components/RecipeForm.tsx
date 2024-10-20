"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import {
	Recipe,
	Grandparent,
	Region,
	Image,
	RecipeStep,
	RecipeStepWithIngredients,
} from "@/types/data";
import { Input, Textarea } from "@nextui-org/input";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {
	useRecipe,
	useRecipes,
	useRecipeStepIngredients,
} from "@/hooks/recipes";
import {
	Autocomplete,
	AutocompleteSection,
	AutocompleteItem,
} from "@nextui-org/autocomplete";
import { useGrandparents } from "@/hooks/grandparents";
import { useRegions } from "@/hooks/regions";
import { useMedia } from "@/hooks/media";
import { useTags } from "@/hooks/tags";
import { useSteps } from "@/hooks/steps";
import { useIngredients } from "@/hooks/ingredients";
import StepCard from "./StepCard";
import {
	createStep,
	postRecipe,
	updateRecipe,
} from "@/data-access/recipes";

const RecipeForm = ({ id }: { id: string }) => {
	const { data } = useRecipe({ recipeId: id });
	const { data: grandparnets } = useGrandparents();
	const { data: regions } = useRegions();
	const { data: media } = useMedia();
	const { data: tagsData } = useTags();
	const { data: recipeSteps } = useSteps(id);
	const { data: ingredients } = useIngredients();
	const [recipe, setRecipe] = useState<Recipe>({
		id: 0,
		slug: "",
		title: "",
		description: "",
		cook_time: 0,
		roots: "",
		dish: "",
		video: "",
		updated_at: "",
		created_at: "",
		region_id: {} as Region,
		grandparents_id: {} as Grandparent,
		image_id: {} as Image,
		category: "",
		published: false,
	});

	useEffect(() => {
		if (recipe.title) {
			setRecipe((prevRecipe) => ({
				...prevRecipe,
				slug: recipe.title.replace(/\s+/g, "-").toLowerCase(),
			}));
		}
	}, [recipe.title]);
	const [steps, setSteps] = useState<RecipeStepWithIngredients[]>([]);
	const [tags, setTags] = useState([]);

	useEffect(() => {
		if (data) {
			setRecipe({
				...data.recipe,
				region_id: data.recipe.region_id,
				grandparents_id: data.recipe.grandparents_id,
				image_id: data.recipe.image_id,
			});
			setTags(data.tags);
			setSteps(data.steps.map((step) => ({ ...step, ingredients: [] })));
		}
	}, [data, tagsData]);

	const handleSubmit = async (type: string) => {
		try {
			if (type === "publish") {
				const resp = await updateRecipe({
					recipe: { ...recipe, published: true },
					steps: steps,
					tags: tags,
				});
				console.log(resp);
			} else {
				const resp = await updateRecipe({
					recipe: { ...recipe, published: false },
					steps: steps,
					tags: tags,
				});
				console.log(resp);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handleNewSubmit = async (type: string) => {
		try {
			if (type === "publish") {
				const resp = await postRecipe({
					recipe: { ...recipe, published: true },
					steps: steps,
					tags: tags,
				});
				console.log(resp);
			} else {
				const resp = await postRecipe({
					recipe: { ...recipe, published: false },
					steps: steps,
					tags: tags,
				});
				console.log(resp);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCreateStep = async () => {
		try {
			const resp = await createStep(id);
			if (resp) {
				setSteps([...steps, { ...resp, ingredients: [] }]);
			}
			console.log(steps);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Input
				label="Title"
				value={recipe.title}
				onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
			/>
			<Input
				label="Description"
				value={recipe.description}
				onChange={(e) =>
					setRecipe({ ...recipe, description: e.target.value })
				}
			/>
			<Input
				label="Cook Time"
				type="number"
				value={recipe.cook_time}
				onChange={(e) =>
					setRecipe({ ...recipe, cook_time: e.target.value })
				}
			/>
			<Input
				label="Roots"
				value={recipe.roots}
				onChange={(e) => setRecipe({ ...recipe, roots: e.target.value })}
			/>
			<Input
				label="Dish"
				value={recipe.dish}
				onChange={(e) => setRecipe({ ...recipe, dish: e.target.value })}
			/>
			{/* <Input
				label="Metrics"
				value={recipe.metrics}
				onChange={(e) => setRecipe({ ...recipe, metrics: e.target.value })}
			/> */}
			<Input
				label="Video"
				value={recipe.video}
				onChange={(e) => setRecipe({ ...recipe, video: e.target.value })}
			/>
			{/* <Input
				label="Meal Size"
				value={recipe.meal_size}
				onChange={(e) =>
					setRecipe({ ...recipe, meal_size: e.target.value })
				}
			/> */}
			{/* <Input
				label="Updated At"
				value={recipe.updated_at}
				onChange={(e) =>
					setRecipe({ ...recipe, updated_at: e.target.value })
				}
			/>
			<Input
				label="Created At"
				value={recipe.created_at}
				onChange={(e) =>
					setRecipe({ ...recipe, created_at: e.target.value })
				}
			/> */}
			<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
				<Select
					onSelectionChange={(keys) => {
						const selectedRegion = regions.find(
							(region) => region.id.toString() === keys.currentKey
						);
						if (selectedRegion) {
							setRecipe({ ...recipe, region_id: selectedRegion });
						}
					}}
					selectedKeys={
						recipe.region_id.id
							? [recipe.region_id.id.toString()]
							: undefined
					}
					label="Select a Region"
					className="max-w-xs"
				>
					{(regions ?? []).map((region) => (
						<SelectItem key={region.id}>{region.title}</SelectItem>
					))}
				</Select>
				<Select
					label="Grandparent"
					placeholder="Select an Grandparent"
					className="max-w-xs"
					onSelectionChange={(keys) => {
						if (grandparnets) {
							const selectedGrandparent = grandparnets.find(
								(grandparent) =>
									grandparent.id.toString() === keys.currentKey
							);
							if (selectedGrandparent) {
								setRecipe({
									...recipe,
									grandparents_id: selectedGrandparent,
								});
							}
						}
					}}
					selectedKeys={
						recipe.grandparents_id.id
							? [recipe.grandparents_id.id.toString()]
							: undefined
					}
				>
					{(grandparnets ?? []).map((grand) => (
						<SelectItem key={grand.id}>{grand.title}</SelectItem>
					))}
				</Select>
				<Select
					label="Select an Image"
					className="max-w-xs"
					onSelectionChange={(keys) => {
						const selectedMedia = media.find(
							(mediaItem) => mediaItem.id.toString() === keys.currentKey
						);
						if (selectedMedia) {
							setRecipe({ ...recipe, image_id: selectedMedia });
						}
					}}
					selectedKeys={
						recipe.image_id.id
							? [recipe.image_id.id.toString()]
							: undefined
					}
				>
					{(media ?? []).map((media) => (
						<SelectItem key={media.id}>{media.filename}</SelectItem>
					))}
				</Select>
			</div>
			<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
				<Select
					label="Tags"
					selectionMode="multiple"
					placeholder="Select Tags"
					className="max-w-xs"
					onSelectionChange={(keys) => {
						const selectedTags = tagsData?.filter((tag) =>
							Array.from(keys).includes(tag.id.toString())
						);
						if (selectedTags) {
							setTags(selectedTags);
						}
					}}
					selectedKeys={tags.map((tag) => tag.id.toString())}
				>
					{(tagsData ?? []).map((tag) => (
						<SelectItem key={tag.id}>{tag.title}</SelectItem>
					))}
				</Select>
			</div>

			<h1>Steps</h1>
			<div className="flex md:grid grid-cols-2 gap-2 flex-wrap">
				{steps &&
					steps.map((item, i) => (
						<StepCard
							key={item?.id?.toString()}
							recipeId={id}
							setSteps={setSteps}
							content={item}
						/>
					))}
			</div>
			<Button onClick={handleCreateStep}>Add Step</Button>

			<div className="flex w-full flex-wrap md:flex-nowrap gap-4">
				<Button
					onClick={() =>
						id !== ""
							? handleSubmit("publish")
							: handleNewSubmit("publish")
					}
				>
					Publish
				</Button>
				<Button
					onClick={() =>
						id !== "" ? handleSubmit("save") : handleNewSubmit("save")
					}
				>
					Save
				</Button>
			</div>
		</div>
	);
};

export default RecipeForm;

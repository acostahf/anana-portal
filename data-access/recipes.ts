import { createClient } from "@/libs/supabase/client";
import {
	Recipe,
	RecipeStep,
	RecipeStepIngredient,
	RecipeStepWithIngredients,
	Tag,
} from "@/types/data";
import { cache } from "react";

export const getRecipes = cache(async (): Promise<Recipe[]> => {
	const supabase = createClient();
	const { data } = await supabase
		.from("recipes")
		.select(`*, region_id(*), grandparents_id(*), image_id(*) `);
	return data;
});

export const getRecipeById = async (recipeId: string) => {
	const supabase = createClient();
	const { data, error: recipesError } = await supabase
		.from("recipes")
		.select(`*, region_id(*), grandparents_id(*), image_id(*) `)
		.eq("id", recipeId)
		.single();
	const { data: stepsData, error: stepsError } = await supabase
		.from("recipes_steps")
		.select(`*, image_id(*)`)
		.eq("_parent_id", data.id)
		.order("_order", { ascending: true });
	const { data: ingredientsData, error: ingredientsError } = await supabase
		.from("recipes_ingredients")
		.select(`*, ingredient_id(*)`)
		.eq("_parent_id", data.id);

	const { data: tagsData, error: tagsError } = await supabase
		.from("recipes_rels")
		.select(`*, tags_id(*)`)
		.eq("parent_id", data.id);

	let tagsDatarefined = tagsData.map((tag) => tag.tags_id);

	if (recipesError || stepsError || ingredientsError || tagsError) {
		return {
			error:
				recipesError.message ||
				stepsError.message ||
				ingredientsError.message ||
				tagsError.message,
		};
	}

	return {
		recipe: data,
		steps: stepsData,
		ingredients: ingredientsData,
		tags: tagsDatarefined,
	};
};

export const getRecipeStepIngredients = async (id: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("recipes_steps_ingredients")
		.select(`*, ingredient_id(*)`)
		.eq("_parent_id", id);

	if (error) {
		console.log("error", error);
		return {
			error: error.message,
		};
	}

	return data;
};

export const postRecipeRating = async (
	recipeId: number,
	rating: number
) => {
	const supabase = createClient();
	//TODO: change to user id and get it from session
	const { data, error } = await supabase
		.from("racipes_ratings")
		.insert([{ recipe_id: recipeId, rating: rating, admin_id: "1" }])
		.select();

	if (error) {
		return {
			error: error.message,
		};
	}

	return data;
};

export const getRecipeRatings = async (id: number) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("racipes_ratings")
		.select(`*`)
		.eq("recipe_id", id);

	let total = 0;
	data.forEach((rating: any) => {
		total += rating.rating;
	});

	if (error) {
		return {
			error: error.message,
		};
	}

	return { rating: total / data.length, total: data.length };
};

export const postRecipe = async (recipe: Recipe) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("recipes")
		.insert([recipe])
		.select();

	if (error) {
		return {
			error: error.message,
		};
	}

	return data;
};

export const updateRecipe = async (updateData: {
	recipe: Recipe;
	steps: RecipeStepWithIngredients[];
	tags: Tag[];
}) => {
	const supabase = createClient();
	const { recipe, tags, steps } = updateData;
	console.log("updateData", updateData);
	const { data: updatedRecipe, error: recipeError } = await supabase
		.from("recipes")
		.update({
			title: recipe.title,
			description: recipe.description,
			cook_time: recipe.cook_time,
			roots: recipe.roots,
			dish: recipe.dish,
			video: recipe.video,
			region_id: recipe.region_id.id, // assuming you're storing just the region_id
			slug: recipe.slug,
			image_id: recipe.image_id.id, // storing image_id as reference
			category: recipe.category,
			published: recipe.published,
		})
		.eq("id", recipe.id);

	if (recipeError) {
		console.error("Error updating recipe:", recipeError);
	}

	//update or insert tags
	// for (const tag of tags) {
	await supabase
		.from("recipes_rels")
		.delete()
		.eq("parent_id", recipe.id)
		.select();

	const { data: insertTagData, error: insertTagError } = await supabase
		.from("recipes_rels")
		.insert(
			tags.map((item) => ({
				parent_id: recipe.id,
				tags_id: item.id,
				order: 1,
				path: "tags",
			}))
		)
		.select();

	if (insertTagError) {
		return {
			error: insertTagError.message,
		};
	}
	// }

	// Update or insert steps
	const { data: updatedSteps, error: stepsError } = await supabase
		.from("recipes_steps")
		.upsert(
			steps.map((step) => ({
				id: step.id, // Include the ID if you have it to update the step
				_parent_id: recipe.id, // Foreign key linking to the recipe
				_order: step._order,
				title: step.title,
				description: step.description,
			}))
		);
	if (stepsError) {
		console.error(
			"Error updating recipe steps:",
			stepsError,
			updatedSteps
		);
	}

	const stepIds = steps.map((step) => step.id);

	await supabase
		.from("recipes_steps")
		.delete()
		.not("id", "in", stepIds)
		.eq("_parent_id", recipe.id);

	console.log("steps", steps[0].ingredients);
	// Upsert into the recipes_ingredients table
	const { data: updatedIngredientReferences, error: ingredientRefError } =
		await supabase.from("recipes_steps_ingredients").upsert(
			steps.flatMap((step) =>
				step.ingredients.map((ingredient) => {
					const isNew = !ingredient.id; // Check if this is a new ingredient (no ID)

					return {
						id: isNew ? crypto.randomUUID() : ingredient.id, // Generate a UUID for new rows
						_parent_id: ingredient._parent_id, // Step ID (foreign key)
						ingredient_id: ingredient.ingredient_id.id, // Reference to the actual ingredient
						quantity: ingredient.quantity, // Quantity of ingredient
						unit: ingredient.unit, // Unit of measurement
						_order: ingredient._order, // Order in the step
					};
				})
			),
			{ onConflict: "id" } // Conflict resolution on `id`
		);

	if (ingredientRefError) {
		console.error(
			"Error upserting ingredient references:",
			ingredientRefError
		);
	}

	return { recipe: updatedRecipe, tags: tags };
};

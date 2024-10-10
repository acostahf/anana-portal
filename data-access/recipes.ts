import { createClient } from "@/libs/supabase/client";
import { Recipe } from "@/types/data";
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

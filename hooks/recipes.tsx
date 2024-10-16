import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getRecipeById,
	getRecipeRatings,
	getRecipes,
	getRecipeStepIngredients,
	postRecipeRating,
} from "@/data-access/recipes";
import {
	Recipe,
	RecipeStepIngredient,
	RecipeStep,
	Tag,
} from "@/types/data";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/libs/query";

interface RecipeQuery {
	recipe: Recipe;
	steps: RecipeStep[];
	ingredients: RecipeStepIngredient[];
	tags: any;
}

export const useRecipes = () => {
	return useQuery({
		queryKey: ["recipes"],
		queryFn: async () => {
			const data = await getRecipes();
			return data as Recipe[];
		},
	});
};

export const useRecipe = ({ recipeId }: { recipeId: string }) => {
	return useQuery({
		queryKey: ["recipe", recipeId],
		queryFn: async () => {
			const data = await getRecipeById(recipeId);

			return data as RecipeQuery;
		},
	});
};

export const useRecipeStepIngredients = ({ id }: { id: string }) => {
	return useQuery({
		queryKey: ["recipe-step-ingredients", id],
		queryFn: async () => {
			const data = await getRecipeStepIngredients(id);
			return data as RecipeStepIngredient[];
		},
	});
};

export const usePostRecipeRating = () => {
	return useMutation({
		mutationFn: async ({
			recipeId,
			rating,
		}: {
			recipeId: number;
			rating: number;
		}) => {
			const response = await postRecipeRating(recipeId, rating);
			return response;
		},
		onSuccess: (_data, variables) => {
			//invalidate the recipe rating query
			getQueryClient().invalidateQueries({
				queryKey: ["recipe-rating", variables.recipeId],
			});
		},
	});
};

export const useRecipeRating = ({ id }: { id: number }) => {
	return useQuery({
		queryKey: ["recipe-rating", id],
		queryFn: async () => {
			const data = await getRecipeRatings(id);
			return data;
		},
	});
};

export const usePostRecipe = () => {
	return useMutation({
		mutationFn: async (recipe: Recipe) => {
			const response = await postRecipe(recipe);
			return response;
		},
		onSuccess: () => {
			getQueryClient().invalidateQueries({
				queryKey: ["recipes"],
			});
		},
	});
};

export const useUpdateRecipe = () => {
	return useMutation({
		mutationFn: async (recipe: Recipe) => {
			const response = await updateRecipe(recipe);
			return response;
		},
		onSuccess: () => {
			getQueryClient().invalidateQueries({
				queryKey: ["recipes"],
			});
		},
	});
};

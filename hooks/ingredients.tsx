import { getIngredients, postIngredient } from "@/data-access/ingredients";
import { Ingredient } from "@/types/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useIngredients = () => {
	return useQuery({
		queryKey: ["ingredients"],
		queryFn: async () => {
			const data = await getIngredients();
			return data as Ingredient[];
		},
	});
};

export const usePostIngredient = () => {
	return useMutation({
		mutationFn: async (ingredient: Ingredient) => {
			const data = await postIngredient(ingredient);
			return data;
		},
	});
};

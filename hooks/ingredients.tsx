import { getIngredients } from "@/data-access/ingredients";
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

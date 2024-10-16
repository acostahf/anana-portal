import { createClient } from "@/libs/supabase/client";

export const getSteps = async (id: string) => {
	const supabase = createClient();
	const { data: steps } = await supabase
		.from("recipes_steps")
		.select(`*`)
		.eq("_parent_id", id);

	if (!steps) {
		return [];
	}

	const stepIds = steps.map((step) => step.id);
	const { data: stepIngredients } = await supabase
		.from("recipes_steps_ingredients")
		.select(`*, ingredient_id(*)`)
		.in("_parent_id", stepIds);

	const stepsWithIngredients = steps.map((step) => ({
		...step,
		ingredients:
			stepIngredients?.filter(
				(ingredient) => ingredient._parent_id === step.id
			) ?? [],
	}));

	return stepsWithIngredients;
};

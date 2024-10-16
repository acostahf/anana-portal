import { createClient } from "@/libs/supabase/client";
import { Ingredient } from "@/types/data";

export const getIngredients = async (): Promise<Ingredient[]> => {
	const supabase = createClient();
	const { data } = await supabase.from("ingredients").select(`*`);
	return data ?? [];
};

import { createClient } from "@/libs/supabase/client";
import { Tag } from "@/types/data";

export const getTags = async (): Promise<Tag[]> => {
	const supabase = createClient();
	const { data } = await supabase.from("tags").select(`*`);
	return data ?? [];
};

import { createClient } from "@/libs/supabase/client";
import { Region } from "@/types/data";

export const getRegions = async (): Promise<Region[]> => {
	const supabase = createClient();
	const { data } = await supabase.from("regions").select(`*`);
	return data ?? [];
};

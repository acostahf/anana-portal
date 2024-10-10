import { createClient } from "@/libs/supabase/client";
import { Image, Media } from "@/types/data";

export const getMedia = async (): Promise<Image[]> => {
	const supabase = createClient();
	const { data } = await supabase.from("media").select(`*`);
	return data ?? [];
};

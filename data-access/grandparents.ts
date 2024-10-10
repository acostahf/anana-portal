import { createClient } from "@/libs/supabase/client";
import { Grandparent } from "@/types/data";

export const getGrandparents = async (): Promise<Grandparent[]> => {
	const supabase = createClient();
	const { data } = await supabase
		.from("grandparents")
		.select(`*, region_id(*), favorites_id(*), image_id(*)`);
	return data;
};

export const getGrandparentById = async (grandparentId: number) => {
	const supabase = createClient();
	const { data: grandparent } = await supabase
		.from("grandparents")
		.select(
			`*, region_id(*), favorites_id(*), image_id(*), 
			grandparents_rels(path, media_id(filename), badges_id(title))`
		)
		.eq("id", grandparentId)
		.single();

	const photos = grandparent.grandparents_rels.filter(
		(rel: any) => rel.path === "photos"
	);
	const badges = grandparent.grandparents_rels.filter(
		(rel: any) => rel.path === "badges"
	);

	grandparent.photos = photos;
	grandparent.badges = badges;
	//remove the grandparents_rels from the grandparent object
	delete grandparent.grandparents_rels;

	const { data: recipes } = await supabase
		.from("recipes")
		.select(`*, image_id(*)`)
		.eq("grandparents_id", grandparentId);

	return {
		grandparent: grandparent,
		recipes: recipes,
	};
};

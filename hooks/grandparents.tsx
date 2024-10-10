import {
	getGrandparentById,
	getGrandparents,
} from "@/data-access/grandparents";
import { Grandparent, Recipe } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useGrandparents = () => {
	return useQuery({
		queryKey: ["grandparents"],
		queryFn: async () => {
			const data = await getGrandparents();
			return data as Grandparent[];
		},
	});
};

interface GrandparentData {
	grandparent: Grandparent;
	recipes: Recipe[];
}

export const useGrandparent = () => {
	const params = useParams();
	const grandparentId = parseInt(params.nonnaId as string);
	return useQuery({
		queryKey: ["grandparent", grandparentId],
		queryFn: async () => {
			const data = await getGrandparentById(grandparentId);
			return data as GrandparentData;
		},
	});
};

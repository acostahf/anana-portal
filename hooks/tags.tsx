import { getTags } from "@/data-access/tags";
import { Tag } from "@/types/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useTags = () => {
	return useQuery({
		queryKey: ["tags"],
		queryFn: async () => {
			const data = await getTags();
			return data as Tag[];
		},
	});
};

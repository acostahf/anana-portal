import { getRegions } from "@/data-access/regions";
import { Region } from "@/types/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRegions = () => {
	return useQuery({
		queryKey: ["regions"],
		queryFn: async () => {
			const data = await getRegions();
			return data as Region[];
		},
	});
};

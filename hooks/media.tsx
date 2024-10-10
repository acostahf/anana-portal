import { getMedia } from "@/data-access/media";
import { Image } from "@/types/data";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMedia = () => {
	return useQuery({
		queryKey: ["media"],
		queryFn: async () => {
			const data = await getMedia();
			return data as Image[];
		},
	});
};

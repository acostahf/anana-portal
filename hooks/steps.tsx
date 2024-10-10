import { getSteps } from "@/data-access/steps";

import { useMutation, useQuery } from "@tanstack/react-query";

export const useSteps = ({ id }) => {
	return useQuery({
		queryKey: ["steps", id],
		queryFn: async () => {
			const data = await getSteps(id);
			return data;
		},
	});
};

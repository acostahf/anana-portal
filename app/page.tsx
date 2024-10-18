"use client";

import MediaSection from "@/components/MediaSection";
import RecipeForm from "@/components/RecipeForm";
import Table from "@/components/Table";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import Tus from "@uppy/tus";
// import { useRecipes } from "@/hooks/recipes";

export default function Home() {
	const supabase = createClient();
	const router = useRouter();
	const [session, setSession] = useState("" as any);
	const [filename, setFilename] = useState("");
	//get auth user session and redirect if not logged in
	const onBeforeRequest = async (req: any) => {
		const { data } = await supabase.auth.getSession();
		req.setHeader("Authorization", `Bearer ${data.session?.access_token}`);
	};
	const [uppy] = useState(() =>
		new Uppy().use(Tus, {
			endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
			onBeforeRequest,
			allowedMetaFields: [
				"bucketName",
				"objectName",
				"contentType",
				"cacheControl",
			],
		})
	);

	uppy.on("file-added", (file) => {
		file.meta = {
			...file.meta,
			bucketName: "supabase-payload",
			contentType: file.type,
			objectName: file.name,
		};
	});
	uppy.on("upload-success", async (file) => {
		const { data, error } = await supabase.storage
			.from("supabase-payload")
			.move(`${file?.name}`, `media/${file?.name}`);

		console.log("------", data);
	});
	useEffect(() => {
		const fetchUser = async () => {
			const { data } = await supabase.auth.getSession();

			if (!data.session?.user) {
				//redirect to login
				router.push("/signin");
			}
			if (data.session?.user) {
				setSession(data.session.access_token);
			}
		};

		fetchUser();
	}, []);

	const [slice, setSlice] = useState(0);
	const [recipe, setRecipe] = useState("");
	const handleSelection = (id: string) => {
		if (id === "new") {
			setSlice(1);
			setRecipe("");
		} else {
			setSlice(1);
			setRecipe(id);
		}
	};
	let sliceZone = <Table handleSelection={handleSelection} />;
	switch (slice) {
		case 1:
			sliceZone = <RecipeForm id={recipe} />;
			break;
		case 2:
			sliceZone = <MediaSection uppy={uppy} />;
			break;
		default:
			<Table handleSelection={handleSelection} />;
	}
	return (
		<section className="h-dvh">
			<div className="flex items-center justify-start gap-4 py-8 md:py-10 border-small rounded-2xl h-dvh overflow-y-scroll">
				<div className="h-full w-72 border-r-small border-divider p-6 flex flex-col gap-2">
					<div>
						<h2
							className="text-2xl font-bold cursor-pointer"
							onClick={() => setSlice(0)}
						>
							Recipes
						</h2>
					</div>
					<div>
						<h2
							className="text-2xl font-bold cursor-pointer"
							onClick={() => setSlice(2)}
						>
							Media
						</h2>
					</div>
				</div>
				<div className="h-full w-full">{sliceZone}</div>
			</div>
		</section>
	);
}

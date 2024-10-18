"use client";
import { createClient } from "@/libs/supabase/client";
import React from "react";

const Page = () => {
	const supabase = createClient();
	const signInWithEmail = async () => {
		const { data, error } = await supabase.auth.signInWithOtp({
			email: "acostahf4@gmail.com",
			options: {
				// set this to false if you do not want the user to be automatically signed up
				shouldCreateUser: false,
				emailRedirectTo: "localhost:3000",
			},
		});
	};

	return (
		<div>
			<button onClick={signInWithEmail}>Sigin with email</button>
		</div>
	);
};

export default Page;

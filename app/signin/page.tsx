"use client";
import { createClient } from "@/libs/supabase/client";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";

const Page = () => {
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const signInWithEmail = async () => {
		setIsLoading(true);

		try {
			const { data, error } = await supabase.auth.signInWithOtp({
				email: email,
				options: {
					// set this to false if you do not want the user to be automatically signed up
					shouldCreateUser: false,
					emailRedirectTo: "localhost:3000",
				},
			});

			if (error) {
				throw error;
			}
			setIsDisabled(true);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center h-full w-full">
			<Card className="w-full max-w-xl space-y-4 p-4">
				<Input
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Button
					className="primary"
					onClick={signInWithEmail}
					isLoading={isLoading}
				>
					Sigin with email
				</Button>
			</Card>
		</div>
	);
};

export default Page;

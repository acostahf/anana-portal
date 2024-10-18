"use client";
import { useRecipes } from "@/hooks/recipes";
import { Button } from "@nextui-org/button";
import {
	Table as NextUITable,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	getKeyValue,
} from "@nextui-org/table";

const columns = [
	{
		key: "title",
		label: "NAME",
	},
	{
		key: "role",
		label: "ROLE",
	},
	{
		key: "status",
		label: "STATUS",
	},
];

interface TableProps {
	handleSelection: (id: string) => void;
}

const Table = ({ handleSelection }: TableProps) => {
	const { data } = useRecipes();

	const handleNewRecipe = () => {
		handleSelection("new");
	};
	if (data) {
		return (
			<div className="flex flex-col gap-2 pr-2">
				<div className="flex justify-end">
					<Button onClick={handleNewRecipe}>Add</Button>
				</div>

				<NextUITable aria-label="Example table with dynamic content">
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key}>{column.label}</TableColumn>
						)}
					</TableHeader>
					<TableBody items={data}>
						{(item) => (
							<TableRow
								className="cursor-pointer hover:bg-white/20"
								onClick={() => handleSelection(item?.id.toString())}
								key={item.id}
							>
								{(columnKey) => (
									<TableCell>{getKeyValue(item, columnKey)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</NextUITable>
			</div>
		);
	}
};

export default Table;

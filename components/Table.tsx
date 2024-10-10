"use client";
import { useRecipes } from "@/hooks/recipes";
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
	if (data) {
		return (
			<NextUITable aria-label="Example table with dynamic content">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn key={column.key}>{column.label}</TableColumn>
					)}
				</TableHeader>
				<TableBody items={data}>
					{(item) => (
						<TableRow
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
		);
	}
};

export default Table;

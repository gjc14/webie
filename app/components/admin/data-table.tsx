import { useFetcher } from '@remix-run/react'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	Table as TableType,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import { EyeOff, Loader2, MoreHorizontal } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	children?: (table: TableType<TData>) => React.ReactNode
	hideColumnFilter?: boolean
}

export function DataTable<TData, TValue>({ columns, data, children, hideColumnFilter }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<section>
			<div className="flex pb-3">
				{children && children(table)}

				{!hideColumnFilter && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								<EyeOff />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter(column => column.getCanHide())
								.map(column => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={value => column.toggleVisibility(!!value)}
											onSelect={e => e.preventDefault()}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
			<Table aria-label="table">
				<TableHeader aria-label="table-header">
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id} className="border-primary">
							{headerGroup.headers.map(header => {
								return (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								aria-label="table-row"
								className="border-border"
							>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex items-center justify-end space-x-2 pt-4">
				<div className="flex-1 text-sm text-muted-foreground pl-2.5">
					{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
					row(s) selected.
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>
		</section>
	)
}

export const AdminDataTableMoreMenu = ({
	route,
	id,
	children,
	hideDelete,
}: {
	route: string
	id: string
	children?: ReactNode
	hideDelete?: boolean
}) => {
	const fetcher = useFetcher()
	const isSubmitting = fetcher.state === 'submitting'
	const isDeleting = fetcher.state !== 'idle'

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size={'icon'} disabled={isDeleting}>
					<span className="sr-only">Open menu</span>
					{isSubmitting ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuLabel>Manage</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{children}
				{!hideDelete && (
					<DropdownMenuItem
						onClick={() =>
							fetcher.submit(null, {
								method: 'DELETE',
								action: `/admin/${route}/${id}/delete`,
							})
						}
					>
						Delete
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

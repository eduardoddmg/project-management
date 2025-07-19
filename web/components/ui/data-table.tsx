// components/data-table.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Determines the number of skeleton rows to display.
  // If data is available, use its length; otherwise, default to 5 for a consistent visual.
  const rowCount = data && data?.length > 0 ? data?.length : 5;

  return (
    <div className="rounded-md border overflow-hidden">
      {' '}
      {/* Added overflow-hidden for cleaner border radius */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {(!data || data.length == 0) && loading ? (
            // Display Skeleton Loading State
            Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((column, colIndex) => (
                  <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            // Display Data When Loaded
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Display No Results Message
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

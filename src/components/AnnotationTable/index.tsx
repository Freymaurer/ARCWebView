import type { ArcTable } from "@nfdi4plants/arctrl";

interface AnnotationTableProps {
  table: ArcTable;
}

import React from 'react'
import {Table, DataTable, type UniqueRow, type Column} from '@primer/react/experimental'

function transpose<T>(columns: T[][]): T[][] {
  if (columns.length === 0) return [];

  const numRows = columns[0].length;
  const numCols = columns.length;

  const rows: T[][] = [];

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    const row: T[] = [];

    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      row.push(columns[colIndex][rowIndex]);
    }

    rows.push(row);
  }

  return rows;
}


export default function AnnotationTable({table}: AnnotationTableProps) {

  const prerows = transpose(table.Columns.map(col => col.Cells.map(cell => cell.toString())));

  const headers = table.Columns.map(col => col.Header.toString());

  const columns: Column<UniqueRow>[] = headers.map((header) => ({
    header,
    field: header as any
  }));

  const prerowObjects = prerows.map((row, index) => {
    const rowObject: UniqueRow = {
      id: String(index)
    };
    table.Columns.forEach((_, colIndex) => {
      const header = headers[colIndex];
      rowObject[header as keyof UniqueRow] = row[colIndex];
    });
    return rowObject as UniqueRow;
  })


  const pageSize = 20
  const [pageIndex, setPageIndex] = React.useState(0)
  const start = pageIndex * pageSize
  const end = start + pageSize
  const rows = prerowObjects.slice(start, end)

  return (
   <Table.Container>
      <DataTable
        aria-labelledby="repositories-pagination"
        data={rows}
        columns={columns}
      />
      <Table.Pagination
        aria-label="Pagination for Repositories"
        pageSize={pageSize}
        totalCount={rows.length}
        onChange={({pageIndex}) => {
          setPageIndex(pageIndex)
        }}
      />
    </Table.Container>
  );
}
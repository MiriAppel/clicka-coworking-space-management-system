import React from 'react';
import {
  useTable,
  Column,
} from '@tanstack/react-table';

interface Person {
  name: string;
  age: number;
}

const MyTable: React.FC = () => {
  const data: Person[] = React.useMemo(
    () => [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 },
    ],
    []
  );

  const columns: Column<Person>[] = React.useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name', // accessor is the "key" in the data
      },
      {
        header: 'Age',
        accessorKey: 'age',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    getRowModel,
  } = useTable<Person>({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.header}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          return (
            <tr {...row.getRowProps()}>
              {row.getVisibleCells().map(cell => (
                <td {...cell.getCellProps()}>{cell.getValue()}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MyTable;

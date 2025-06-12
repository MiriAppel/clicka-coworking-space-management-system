import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
// import TableChartIcon from '@mui/icons-material/TableChart';
import {   } from "@mui/material";

export const CustomersList = () => {

    //זה דוג' לטבלה עם סינון ומיון הנתונים זה רק דו' צריך להכניס נתונים ופונ' בהתאם
    // אפשר להשתמש גם בטבלה מסוג Collapsible table
    // כדי להרחיב שורות וכך לראות הסטוריה ופרטים נוספים - לראות דוג' מהאתר 
    // חלק מפרטי המשתמש יהיו לינקים לחוזים ואינטרקציות שלו
    // וכן צריך להוסיף אפשרות של עריכת הנתונים
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
    ];

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const paginationModel = { page: 0, pageSize: 5 };


    return (
        <div>
            <h1>Customers</h1>

            <Button variant="contained"> יצוא לאקסל/CSV</Button>

            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    );
}

// זה דוג' לטבלה פשוטה עם כותרות ונתונים--------------------

// const createData = (
//     name: string,
//     calories: number,
//     fat: number,
//     carbs: number,
//     protein: number,
// ) => {
//     return { name, calories, fat, carbs, protein };
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

// return (
//     <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//                 <TableRow>
//                     <TableCell>Dessert (100g serving)</TableCell>
//                     <TableCell align="right">Calories</TableCell>
//                     <TableCell align="right">Fat&nbsp;(g)</TableCell>
//                     <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//                     <TableCell align="right">Protein&nbsp;(g)</TableCell>
//                 </TableRow>
//             </TableHead>
//             <TableBody>
//                 {rows.map((row) => (
//                     <TableRow
//                         key={row.name}
//                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                     >
//                         <TableCell component="th" scope="row">
//                             {row.name}
//                         </TableCell>
//                         <TableCell align="right">{row.calories}</TableCell>
//                         <TableCell align="right">{row.fat}</TableCell>
//                         <TableCell align="right">{row.carbs}</TableCell>
//                         <TableCell align="right">{row.protein}</TableCell>
//                     </TableRow>
//                 ))}
//             </TableBody>
//         </Table>
//     </TableContainer>
// );
// }

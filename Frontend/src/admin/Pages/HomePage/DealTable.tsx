import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  no: number,
  image: string,
  category: string,
  discount: number,
) {
  return { no, image, category, discount };
}

const rows = [
  createData(1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 'Smart Watches', 20),
  createData(2, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Headphones', 30),
  createData(3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'Footwear', 15),
  createData(4, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', 'Cameras', 25),
  createData(5, 'https://images.unsplash.com/photo-1583394838336-acd977736f90', 'Gaming', 10),
];

export default function DealTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="deal table">
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Category</StyledTableCell>
            <StyledTableCell align="right">Discount</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.no}>
              <StyledTableCell component="th" scope="row">
                {row.no}
              </StyledTableCell>
              <StyledTableCell>
                <img
                  src={row.image}
                  alt={row.category}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </StyledTableCell>
              <StyledTableCell>{row.category}</StyledTableCell>
              <StyledTableCell align="right">{row.discount}%</StyledTableCell>
              <StyledTableCell align="right">
                <Button variant="contained" color="primary">
                  <Edit />
                </Button>
              </StyledTableCell>
              <StyledTableCell align="right">
                <IconButton sx={{ color: "red" }}>
                  <Delete />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

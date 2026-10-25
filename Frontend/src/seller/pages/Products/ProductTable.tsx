import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useEffect } from 'react';
import React from 'react';
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice';
import type { Product } from '../../../types/ProductTypes';
import { Button, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);

  const handleUpdateClick = (product: Product) => {
    // Handler for future edit product modal / navigation
    if (product.id) {
      // product edit action
    }
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchSellerProducts(jwt));
    }
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="seller product table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">MRP</StyledTableCell>
            <StyledTableCell align="right">Selling</StyledTableCell>
            <StyledTableCell align="right">Color</StyledTableCell>
            <StyledTableCell align="right">Update Stock</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerProduct.products && sellerProduct.products.length > 0 ? (
            sellerProduct.products.map((item: Product) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    {item.images?.map((img, i) => (
                      <img
                        key={i}
                        className="rounded-md w-10 h-10 object-cover"
                        src={img}
                        alt={item.title || "Product"}
                      />
                    ))}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">{item.title}</StyledTableCell>
                <StyledTableCell align="right">₹{item.mrpPrice}</StyledTableCell>
                <StyledTableCell align="right">₹{item.sellingPrice}</StyledTableCell>
                <StyledTableCell align="right">{item.color}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    color={item.in_stock ? "success" : "error"}
                  >
                    {item.in_stock ? "In stock" : "Out of stock"}
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleUpdateClick(item)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell
                colSpan={7}
                align="center"
                sx={{ py: 4, color: "text.secondary" }}
              >
                No products found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

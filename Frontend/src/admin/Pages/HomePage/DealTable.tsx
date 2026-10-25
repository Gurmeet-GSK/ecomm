import React from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { deleteDeal, getAllDeals } from '../../../State/admin/DealSlice';
import type { Deal } from '../../../types/dealTypes';

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

export default function DealTable() {
  const dispatch = useAppDispatch();
  const { deal, customer } = useAppSelector((store) => store);

  React.useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  // Fallback to customer.homePageData?.deals if deal.deals is empty
  const deals: Deal[] =
    deal.deals && deal.deals.length > 0
      ? deal.deals
      : (customer.homePageData?.deals as Deal[]) || [];

  const handleUpdate = (dealId?: number) => {
    if (dealId !== undefined) {
      // Future update modal or action trigger
      console.log("Update deal with id:", dealId);
    }
  };

  const handleDelete = (dealId?: number) => {
    if (dealId !== undefined) {
      dispatch(deleteDeal(dealId));
    }
  };

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
          {deals.length > 0 ? (
            deals.map((item: Deal, index: number) => (
              <StyledTableRow key={item.id ?? index}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>
                  <img
                    src={item.category?.image}
                    alt={item.category?.name || "Deal Category"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  {item.category?.name || item.category?.categoryId || "N/A"}
                </StyledTableCell>
                <StyledTableCell align="right">{item.discount}%</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdate(item.id)}
                  >
                    <Edit fontSize="small" />
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell
                colSpan={6}
                align="center"
                sx={{ py: 4, color: "text.secondary" }}
              >
                No deals available
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

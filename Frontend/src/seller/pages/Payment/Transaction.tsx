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
import { fetchTransactionsBySeller } from '../../../State/seller/transactionSlice';
import type { Transaction } from '../../../types/Transaction';

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

export default function TransactionTable() {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((store) => store.transaction);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchTransactionsBySeller(jwt));
    }
  }, [dispatch]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Customer Details</StyledTableCell>
            <StyledTableCell align="right">Order</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction: Transaction) => (
              <StyledTableRow key={transaction.id}>
                <StyledTableCell component="th" scope="row">
                  {formatDate(transaction.date)}
                </StyledTableCell>
                <StyledTableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {transaction.customer?.fullName || "Guest Customer"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {transaction.customer?.email}
                    </span>
                    {transaction.customer?.mobile && (
                      <span className="text-xs text-gray-500">
                        {transaction.customer.mobile}
                      </span>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-700">
                      Order #{transaction.order?.id || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Status: {transaction.order?.orderStatus || "PENDING"}
                    </span>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <span className="font-bold text-teal-700">
                    ₹{transaction.order?.totalSellingPrice ?? transaction.order?.totalMrpPrice ?? 0}
                  </span>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                No transactions found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

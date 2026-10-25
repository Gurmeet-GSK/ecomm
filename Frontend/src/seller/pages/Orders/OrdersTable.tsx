import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../../State/seller/sellerOrderSlice";
import type { Order } from "../../../types/orderTypes";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const orderStatusList = [
  { color: "#FFA500", label: "PENDING" },
  { color: "#F5EE38", label: "CONFIRMED" },
  { color: "#1E90FF", label: "SHIPPED" },
  { color: "#32CD32", label: "DELIVERED" },
  { color: "#FF0000", label: "CANCELLED" },
];

export default function OrdersTable() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((store) => store.sellerOrder);
  const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchSellerOrders(jwt));
    }
  }, [dispatch]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleClose = (orderId: number) => {
    setAnchorEl((prev) => ({ ...prev, [orderId]: null }));
  };

  const handleUpdateStatus = (orderId: number, status: string) => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(updateOrderStatus({ orderId, orderStatus: status, jwt }));
    handleClose(orderId);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
            <StyledTableCell align="right">Shipping Address</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                Loading orders...
              </StyledTableCell>
            </StyledTableRow>
          ) : orders && orders.length > 0 ? (
            orders.map((order: Order) => (
              <StyledTableRow key={order.id}>
                <StyledTableCell component="th" scope="row">
                  {order.id}
                </StyledTableCell>

                <StyledTableCell>
                  <div className="flex gap-2 items-center flex-wrap">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <img
                          className="w-10 h-10 object-cover rounded"
                          src={item.product?.images?.[0]}
                          alt={item.product?.title}
                        />
                        <div className="text-xs">
                          <p className="font-semibold">{item.product?.title}</p>
                          <p className="text-gray-500">
                            Qty: {item.quantity} | ₹{item.sellingPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold">{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    <p>{order.shippingAddress?.state} - {order.shippingAddress?.pinCode}</p>
                    <p className="text-gray-500">Mobile: {order.shippingAddress?.mobile}</p>
                  </div>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {order.orderStatus}
                  </span>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => handleClick(e, order.id)}
                  >
                    Status
                  </Button>
                  <Menu
                    anchorEl={anchorEl[order.id]}
                    open={Boolean(anchorEl[order.id])}
                    onClose={() => handleClose(order.id)}
                  >
                    {orderStatusList.map((status) => (
                      <MenuItem
                        key={status.label}
                        onClick={() => handleUpdateStatus(order.id, status.label)}
                      >
                        {status.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                No seller orders found
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

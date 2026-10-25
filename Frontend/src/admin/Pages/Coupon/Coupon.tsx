import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { deleteCoupon, fetchAllCoupons } from "../../../State/customer/couponSlice";
import type { Coupon as CouponType } from "../../../types/couponTypes";

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

const Coupon = () => {
    const dispatch = useAppDispatch();
    const { coupons, loading } = useAppSelector((store) => store.coupon);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt") || "";
        if (jwt) {
            dispatch(fetchAllCoupons(jwt));
        }
    }, [dispatch]);

    const handleDelete = (id: number) => {
        const jwt = localStorage.getItem("jwt") || "";
        if (jwt) {
            dispatch(deleteCoupon({ id, jwt }));
        }
    };

    return (
        <div className="space-y-5">
            <h1 className="text-xl font-bold text-gray-800">Coupons Management</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="coupons table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Coupon Code</StyledTableCell>
                            <StyledTableCell>Valid From</StyledTableCell>
                            <StyledTableCell>Valid Till</StyledTableCell>
                            <StyledTableCell align="right">Minimum Purchase (₹)</StyledTableCell>
                            <StyledTableCell align="right">Discount (%)</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                            <StyledTableCell align="right">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                    Loading coupons...
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : coupons && coupons.length > 0 ? (
                            coupons.map((coupon: CouponType) => (
                                <StyledTableRow key={coupon.id}>
                                    <StyledTableCell component="th" scope="row" className="font-semibold text-teal-700">
                                        {coupon.code}
                                    </StyledTableCell>
                                    <StyledTableCell>{coupon.validityStartDate}</StyledTableCell>
                                    <StyledTableCell>{coupon.validityEndDate}</StyledTableCell>
                                    <StyledTableCell align="right">₹{coupon.minimumOrderValue}</StyledTableCell>
                                    <StyledTableCell align="right">{coupon.discountPercentage}%</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                coupon.active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {coupon.active ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton
                                            sx={{ color: "red" }}
                                            size="small"
                                            onClick={() => handleDelete(coupon.id)}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                    No coupons available. Click "Add New Coupon" to create one.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Coupon;

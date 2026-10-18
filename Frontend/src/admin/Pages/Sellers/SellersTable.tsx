import { useState } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

const accountStatuses = [
    {
        status: "PENDING_VERIFICATION",
        title: "Pending Verification",
        description: "Account is pending verification",
    },
    {
        status: "ACTIVE",
        title: "Active",
        description: "Account is active and in good standing",
    },
    {
        status: "SUSPENDED",
        title: "Suspended",
        description: "Account is temporarily suspended",
    },
    {
        status: "DEACTIVATED",
        title: "Deactivated",
        description: "Account is deactivated",
    },
    {
        status: "BANNED",
        title: "Banned",
        description: "Account is permanently banned due to policy violations",
    },
    {
        status: "CLOSED",
        title: "Closed",
        description: "Account is permanently closed",
    },
];

const sellers = [
    {
        id: 1,
        sellerName: "Zosh Fashion Store",
        mobile: "9876543210",
        email: "zosh@fashion.com",
        businessName: "Zosh Retail Ltd",
        gstin: "29ABCDE1234F1Z5",
        accountStatus: "ACTIVE",
    },
    {
        id: 2,
        sellerName: "Tech Hub Electronics",
        mobile: "9123456789",
        email: "contact@techhub.com",
        businessName: "Tech Hub Pvt Ltd",
        gstin: "27ABCDE5678G2Z6",
        accountStatus: "PENDING_VERIFICATION",
    },
    {
        id: 3,
        sellerName: "Elite Footwear",
        mobile: "9988776655",
        email: "support@elitefootwear.com",
        businessName: "Elite Enterprises",
        gstin: "07ABCDE9012H3Z7",
        accountStatus: "SUSPENDED",
    },
    {
        id: 4,
        sellerName: "Cozy Home Decor",
        mobile: "9765432109",
        email: "info@cozyhome.com",
        businessName: "Cozy Furnishings",
        gstin: "33ABCDE3456I4Z8",
        accountStatus: "ACTIVE",
    },
];

const SellersTable = () => {
    const [accountStatus, setAccountStatus] = useState("ACTIVE");

    const handleChange = (event: any) => {
        setAccountStatus(event.target.value);
    };

    const filteredSellers = sellers.filter((seller) => {
        if (!accountStatus) return true;
        return seller.accountStatus === accountStatus;
    });

    return (
        <div className="space-y-5">
            <div className="pb-5 w-60">
                <FormControl fullWidth>
                    <InputLabel id="account-status-select-label">Account Status</InputLabel>
                    <Select
                        labelId="account-status-select-label"
                        id="account-status-select"
                        value={accountStatus}
                        label="Account Status"
                        onChange={handleChange}
                    >
                        {accountStatuses.map((item) => (
                            <MenuItem key={item.status} value={item.status}>
                                {item.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="sellers table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Seller Name</StyledTableCell>
                            <StyledTableCell>Mobile</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Business Name</StyledTableCell>
                            <StyledTableCell>GSTIN</StyledTableCell>
                            <StyledTableCell>Account Status</StyledTableCell>
                            <StyledTableCell align="right">Change Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredSellers.length > 0 ? filteredSellers : sellers).map((seller) => (
                            <StyledTableRow key={seller.id}>
                                <StyledTableCell component="th" scope="row">
                                    {seller.sellerName}
                                </StyledTableCell>
                                <StyledTableCell>{seller.mobile}</StyledTableCell>
                                <StyledTableCell>{seller.email}</StyledTableCell>
                                <StyledTableCell>{seller.businessName}</StyledTableCell>
                                <StyledTableCell>{seller.gstin}</StyledTableCell>
                                <StyledTableCell>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            seller.accountStatus === "ACTIVE"
                                                ? "bg-green-100 text-green-800"
                                                : seller.accountStatus === "PENDING_VERIFICATION"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : seller.accountStatus === "SUSPENDED"
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {seller.accountStatus}
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button variant="text" color="primary">
                                        Update
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default SellersTable;

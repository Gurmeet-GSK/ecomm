import React, { useEffect } from "react";
import {
    Avatar,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import {
    Storefront,
    Email,
    Phone,
    LocationOn,
    AccountBalance,
    Badge,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchSellerProfile } from "../../../State/seller/sellerSlice";

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state) => state.seller);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt && !profile) {
            dispatch(fetchSellerProfile(jwt));
        }
    }, [dispatch, profile]);

    return (
        <div className="space-y-6">
            {/* Header Profile Card */}
            <Card className="rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#00897b",
                            fontSize: 32,
                            fontWeight: 700,
                        }}
                    >
                        {profile?.sellerName?.[0]?.toUpperCase() || "S"}
                    </Avatar>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <h1 className="text-2xl font-extrabold text-gray-900">
                                {profile?.sellerName || "Seller Name"}
                            </h1>
                            {profile?.accountStatus && (
                                <Chip
                                    label={profile.accountStatus}
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            profile.accountStatus === "ACTIVE"
                                                ? "#2e7d32"
                                                : "#f57c00",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                    }}
                                />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            Store: {profile?.businessDetails?.businessName || "N/A"}
                        </p>
                    </div>
                </div>
            </Card>

            <Grid container spacing={3}>
                {/* Contact & Store Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="rounded-xl border border-gray-100 shadow-sm h-full">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-teal-800 font-bold">
                                <Storefront />
                                <Typography variant="h6">Store & Contact Details</Typography>
                            </div>
                            <Divider />

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Email className="text-gray-400" fontSize="small" />
                                    <span>
                                        <strong>Email:</strong> {profile?.email || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Phone className="text-gray-400" fontSize="small" />
                                    <span>
                                        <strong>Mobile:</strong> {profile?.mobile || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Badge className="text-gray-400" fontSize="small" />
                                    <span>
                                        <strong>GSTIN:</strong> {profile?.gstin || profile?.GSTIN || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bank Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="rounded-xl border border-gray-100 shadow-sm h-full">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-teal-800 font-bold">
                                <AccountBalance />
                                <Typography variant="h6">Bank Account Details</Typography>
                            </div>
                            <Divider />

                            <div className="space-y-3 text-sm">
                                <p className="text-gray-700">
                                    <strong>Account Holder:</strong>{" "}
                                    {profile?.bankDetails?.accountHolderName || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Account Number:</strong>{" "}
                                    {profile?.bankDetails?.accountNumber || "N/A"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>IFSC Code:</strong>{" "}
                                    {profile?.bankDetails?.ifscCode || "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pickup Address */}
                <Grid size={{ xs: 12 }}>
                    <Card className="rounded-xl border border-gray-100 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-teal-800 font-bold">
                                <LocationOn />
                                <Typography variant="h6">Pickup Address</Typography>
                            </div>
                            <Divider />

                            <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-semibold">
                                    {profile?.pickupAddress?.name || profile?.sellerName} (
                                    {profile?.pickupAddress?.mobile || profile?.mobile})
                                </p>
                                <p>
                                    {profile?.pickupAddress?.address},{" "}
                                    {profile?.pickupAddress?.locality}
                                </p>
                                <p>
                                    {profile?.pickupAddress?.city},{" "}
                                    {profile?.pickupAddress?.state} -{" "}
                                    {profile?.pickupAddress?.pinCode}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
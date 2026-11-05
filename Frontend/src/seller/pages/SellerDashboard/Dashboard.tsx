import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Divider,
    Button,
    Chip,
} from "@mui/material";
import {
    TrendingUp,
    ShoppingBag,
    Inventory2,
    AccountBalanceWallet,
    Cancel,
    Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchSellerReport } from "../../../State/seller/sellerSlice";
import { fetchSellerOrders } from "../../../State/seller/sellerOrderSlice";
import { fetchSellerProducts } from "../../../State/seller/sellerProductSlice";

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { profile, report } = useAppSelector((state) => state.seller);
    const { orders } = useAppSelector((state) => state.sellerOrder);
    const { products } = useAppSelector((state) => state.sellerProduct);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(fetchSellerReport(jwt));
            dispatch(fetchSellerOrders(jwt));
            dispatch(fetchSellerProducts(jwt));
        }
    }, [dispatch]);

    const stats = [
        {
            title: "Total Earnings",
            value: `₹${(report?.totalEarnings ?? 0).toLocaleString("en-IN")}`,
            subtitle: `Net: ₹${(report?.netEarnings ?? 0).toLocaleString("en-IN")}`,
            icon: <TrendingUp sx={{ fontSize: 32, color: "#00897b" }} />,
            bg: "bg-teal-50",
            border: "border-teal-200",
        },
        {
            title: "Total Orders",
            value: (report?.totalOrders ?? orders?.length ?? 0).toString(),
            subtitle: `${report?.canceledOrders ?? 0} cancelled`,
            icon: <ShoppingBag sx={{ fontSize: 32, color: "#1e88e5" }} />,
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
        {
            title: "Active Products",
            value: (products?.length ?? 0).toString(),
            subtitle: "Listed in store",
            icon: <Inventory2 sx={{ fontSize: 32, color: "#8e24aa" }} />,
            bg: "bg-purple-50",
            border: "border-purple-200",
        },
        {
            title: "Total Transactions",
            value: (report?.totalTransactions ?? 0).toString(),
            subtitle: `Refunds: ₹${(report?.totalRefunds ?? 0).toLocaleString("en-IN")}`,
            icon: <AccountBalanceWallet sx={{ fontSize: 32, color: "#fb8c00" }} />,
            bg: "bg-amber-50",
            border: "border-amber-200",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Greeting Banner */}
            <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Typography variant="h5" className="font-extrabold tracking-tight">
                            Welcome back, {profile?.sellerName || "Partner"}!
                        </Typography>
                        {profile?.accountStatus && (
                            <Chip
                                label={profile.accountStatus}
                                size="small"
                                sx={{
                                    bgcolor: profile.accountStatus === "ACTIVE" ? "#2e7d32" : "#f57c00",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                }}
                            />
                        )}
                    </div>
                    <Typography variant="body2" className="text-teal-100 mt-1">
                        {profile?.businessDetails?.businessName
                            ? `${profile.businessDetails.businessName} • Manage your sales, catalog, and store orders.`
                            : "Manage your sales, catalog, and store orders."}
                    </Typography>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="contained"
                        onClick={() => navigate("/seller/add-product")}
                        sx={{
                            bgcolor: "#fff",
                            color: "#00695c",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { bgcolor: "#f0fdfa" },
                        }}
                    >
                        + Add Product
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/seller/orders")}
                        sx={{
                            borderColor: "#fff",
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { borderColor: "#f0fdfa", bgcolor: "rgba(255,255,255,0.08)" },
                        }}
                    >
                        View Orders
                    </Button>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <Grid container spacing={3}>
                {stats.map((stat, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                        <Card className={`rounded-xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        {stat.title}
                                    </span>
                                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <Typography variant="h4" className="font-extrabold text-gray-900 tracking-tight">
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500 font-medium">
                                    {stat.subtitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions & Store Overview */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card className="rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                            <Button
                                size="small"
                                onClick={() => navigate("/seller/orders")}
                                sx={{ color: "#00897b", textTransform: "none", fontWeight: 700 }}
                            >
                                See All
                            </Button>
                        </div>
                        <Divider />
                        {orders && orders.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map((order: any) => (
                                    <div key={order.id} className="py-3 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                            <p className="text-xs text-gray-500">
                                                {order.orderItems?.length || 0} items • ₹{order.totalSellingPrice || 0}
                                            </p>
                                        </div>
                                        <Chip
                                            label={order.orderStatus}
                                            size="small"
                                            sx={{
                                                fontSize: "0.7rem",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <ShoppingBag sx={{ fontSize: 48, opacity: 0.3 }} />
                                <p className="mt-2 text-sm">No orders yet</p>
                            </div>
                        )}
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Card className="rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Store Quick Links</h2>
                        <Divider />
                        <div className="space-y-2">
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate("/seller/products")}
                                startIcon={<Inventory2 />}
                                sx={{
                                    justifyContent: "flex-start",
                                    py: 1.2,
                                    borderColor: "#e5e7eb",
                                    color: "#374151",
                                    textTransform: "none",
                                    "&:hover": { borderColor: "#00897b", color: "#00897b" },
                                }}
                            >
                                Manage Products Catalog
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate("/seller/payment")}
                                startIcon={<AccountBalanceWallet />}
                                sx={{
                                    justifyContent: "flex-start",
                                    py: 1.2,
                                    borderColor: "#e5e7eb",
                                    color: "#374151",
                                    textTransform: "none",
                                    "&:hover": { borderColor: "#00897b", color: "#00897b" },
                                }}
                            >
                                Payments & Earnings
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate("/seller/transaction")}
                                startIcon={<Receipt />}
                                sx={{
                                    justifyContent: "flex-start",
                                    py: 1.2,
                                    borderColor: "#e5e7eb",
                                    color: "#374151",
                                    textTransform: "none",
                                    "&:hover": { borderColor: "#00897b", color: "#00897b" },
                                }}
                            >
                                Transaction History
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate("/seller/account")}
                                startIcon={<Cancel sx={{ transform: "rotate(45deg)" }} />}
                                sx={{
                                    justifyContent: "flex-start",
                                    py: 1.2,
                                    borderColor: "#e5e7eb",
                                    color: "#374151",
                                    textTransform: "none",
                                    "&:hover": { borderColor: "#00897b", color: "#00897b" },
                                }}
                            >
                                Store Account & Tax Profile
                            </Button>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;

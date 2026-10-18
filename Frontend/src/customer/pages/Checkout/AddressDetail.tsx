import React, { useState } from "react";
import {
    Button,
    Radio,
    RadioGroup,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Add,
    CheckCircleOutlined,
    DeleteOutlined,
    PaymentOutlined,
    LocalAtmOutlined,
} from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import AddressForm from "./AddressForm";
import type { Address } from "./AddressForm";
import PricingCard from "../Cart/PricingCard";

interface AddressDetailProps {
    onCheckoutSuccess?: (orderData: { address: Address; gateway: string }) => void;
}

// Initial sample address matching screenshot reference
const INITIAL_ADDRESSES: Address[] = [
    {
        id: "1",
        name: "Zosh",
        mobile: "9023379136",
        pinCode: "530068",
        address: "Ambavadi choke",
        locality: "Banglor",
        city: "Banglor",
        state: "karnataka",
        addressType: "HOME",
        isDefault: true,
    },
    {
        id: "2",
        name: "Ashok Singh",
        mobile: "9876543210",
        pinCode: "560001",
        address: "Flat 402, Green Heights, MG Road",
        locality: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        addressType: "WORK",
        isDefault: false,
    },
];

const RAZORPAY_LOGO = "https://i.pinimg.com/736x/51/db/42/51db42e826f33720d111cbeb16e85cb8.jpg";
const STRIPE_LOGO = "https://i.pinimg.com/236x/38/c3/3e/38c33e47c4143741b421b8657ad8f00d.jpg";

const AddressDetail: React.FC<AddressDetailProps> = ({ onCheckoutSuccess }) => {
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
    const [paymentGateway, setPaymentGateway] = useState<"razorpay" | "stripe" | "cod">("razorpay");
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleAddAddress = (newAddress: Address) => {
        setAddresses((prev) => [newAddress, ...prev]);
        setSelectedAddressId(newAddress.id);
    };

    const handleDeleteAddress = (idToDelete: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (addresses.length <= 1) {
            alert("At least one delivery address is required.");
            return;
        }
        setAddresses((prev) => prev.filter((a) => a.id !== idToDelete));
        if (selectedAddressId === idToDelete) {
            const remaining = addresses.filter((a) => a.id !== idToDelete);
            if (remaining.length > 0) {
                setSelectedAddressId(remaining[0].id);
            }
        }
    };

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    const handleCheckout = () => {
        if (!selectedAddress) {
            alert("Please select or add a delivery address.");
            return;
        }
        if (onCheckoutSuccess) {
            onCheckoutSuccess({
                address: selectedAddress,
                gateway: paymentGateway,
            });
        } else {
            alert(
                `Order confirmed!\nDelivering to: ${selectedAddress.name} (${selectedAddress.city})\nPayment via: ${paymentGateway.toUpperCase()}`
            );
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Address Selection */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                Select Delivery Address
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Choose from your saved addresses or add a new one
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setIsAddressModalOpen(true)}
                            startIcon={<Add fontSize="small" />}
                            sx={{
                                color: teal[700],
                                borderColor: teal[600],
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                borderRadius: "8px",
                                textTransform: "uppercase",
                                px: 2,
                                py: 0.8,
                                "&:hover": {
                                    borderColor: teal[800],
                                    bgcolor: "rgba(13, 148, 136, 0.05)",
                                },
                            }}
                        >
                            Add New Address
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <span>Saved Addresses</span>
                            <span>{addresses.length} Available</span>
                        </div>

                        {/* List of Saved Addresses */}
                        <div className="space-y-3">
                            {addresses.map((addr) => {
                                const isSelected = selectedAddressId === addr.id;
                                return (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-pointer relative ${
                                            isSelected
                                                ? "border-2 border-teal-600 bg-teal-50/20 shadow-xs"
                                                : "border-gray-200 hover:border-gray-300 bg-white shadow-xs"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <Radio
                                                    checked={isSelected}
                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                    value={addr.id}
                                                    name="address-radio"
                                                    size="small"
                                                    sx={{
                                                        p: 0,
                                                        mt: 0.3,
                                                        color: teal[600],
                                                        "&.Mui-checked": { color: teal[600] },
                                                    }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 text-base">
                                                            {addr.name}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                            {addr.addressType || "HOME"}
                                                        </span>
                                                        {isSelected && (
                                                            <span className="text-[11px] font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <CheckCircleOutlined sx={{ fontSize: "12px" }} />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                                                        {addr.address}, {addr.locality}, {addr.city},{" "}
                                                        {addr.state} - {addr.pinCode}
                                                    </p>

                                                    <p className="text-sm text-gray-800 font-medium mt-1">
                                                        <strong className="text-gray-900 font-semibold">
                                                            Mobile:{" "}
                                                        </strong>
                                                        {addr.mobile}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Delete Address Button */}
                                            {addresses.length > 1 && (
                                                <Tooltip title="Delete address" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleDeleteAddress(addr.id, e)}
                                                        sx={{
                                                            color: "#9ca3af",
                                                            "&:hover": { color: "#dc2626", bgcolor: "rgba(220, 38, 38, 0.08)" },
                                                        }}
                                                    >
                                                        <DeleteOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* + ADD NEW ADDRESS Dashed Card */}
                            <div
                                onClick={() => setIsAddressModalOpen(true)}
                                className="border-2 border-dashed border-gray-300 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer flex items-center justify-center gap-2 text-teal-700 hover:text-teal-800 hover:bg-teal-50/20 font-semibold text-sm transition-all duration-200"
                            >
                                <Add fontSize="small" />
                                <span>ADD NEW ADDRESS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 1 Column: Payment Gateway & PricingCard */}
                <div className="col-span-1 space-y-4 h-fit">
                    {/* Payment Gateway Selection Card */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs space-y-4">
                        <div className="flex items-center gap-2">
                            <PaymentOutlined sx={{ color: teal[600], fontSize: "20px" }} />
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm tracking-tight">
                                    Choose Payment Gateway
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                    Secure, encrypted transactions
                                </p>
                            </div>
                        </div>

                        {/* Radio options for single selection */}
                        <RadioGroup
                            value={paymentGateway}
                            onChange={(e) => setPaymentGateway(e.target.value as "razorpay" | "stripe")}
                            className="space-y-3"
                        >
                            {/* Option 1: Razorpay */}
                            <div
                                onClick={() => setPaymentGateway("razorpay")}
                                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                                    paymentGateway === "razorpay"
                                        ? "border-2 border-teal-600 bg-teal-50/20 shadow-xs"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Radio
                                        checked={paymentGateway === "razorpay"}
                                        value="razorpay"
                                        size="small"
                                        sx={{
                                            p: 0,
                                            color: teal[600],
                                            "&.Mui-checked": { color: teal[600] },
                                        }}
                                    />
                                    <div>
                                        <span className="font-semibold text-sm text-gray-800 block">
                                            Razorpay
                                        </span>
                                        <span className="text-[11px] text-gray-500 block">
                                            UPI, Cards, NetBanking, Wallets
                                        </span>
                                    </div>
                                </div>
                                <div className="h-8 w-24 flex items-center justify-end">
                                    <img
                                        src={RAZORPAY_LOGO}
                                        alt="Razorpay"
                                        className="max-h-7 max-w-full object-contain rounded"
                                    />
                                </div>
                            </div>

                            {/* Option 2: Stripe */}
                            <div
                                onClick={() => setPaymentGateway("stripe")}
                                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                                    paymentGateway === "stripe"
                                        ? "border-2 border-teal-600 bg-teal-50/20 shadow-xs"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Radio
                                        checked={paymentGateway === "stripe"}
                                        value="stripe"
                                        size="small"
                                        sx={{
                                            p: 0,
                                            color: teal[600],
                                            "&.Mui-checked": { color: teal[600] },
                                        }}
                                    />
                                    <div>
                                        <span className="font-semibold text-sm text-gray-800 block">
                                            Stripe
                                        </span>
                                        <span className="text-[11px] text-gray-500 block">
                                            Credit / Debit Cards (Global)
                                        </span>
                                    </div>
                                </div>
                                <div className="h-8 w-24 flex items-center justify-end">
                                    <img
                                        src={STRIPE_LOGO}
                                        alt="Stripe"
                                        className="max-h-7 max-w-full object-contain rounded"
                                    />
                                </div>
                            </div>

                            {/* Option 3: Pay on delivery (Cash on Delivery) */}
                            <div
                                onClick={() => setPaymentGateway("cod")}
                                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                                    paymentGateway === "cod"
                                        ? "border-2 border-teal-600 bg-teal-50/20 shadow-xs"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Radio
                                        checked={paymentGateway === "cod"}
                                        value="cod"
                                        size="small"
                                        sx={{
                                            p: 0,
                                            color: teal[600],
                                            "&.Mui-checked": { color: teal[600] },
                                        }}
                                    />
                                    <div>
                                        <span className="font-semibold text-sm text-gray-800 block">
                                            Pay on Delivery
                                        </span>
                                        <span className="text-[11px] text-gray-500 block">
                                            Pay with Cash / UPI upon arrival
                                        </span>
                                    </div>
                                </div>
                                <div className="h-8 px-2 flex items-center justify-center bg-gray-50 rounded border border-gray-200 text-teal-700">
                                    <LocalAtmOutlined sx={{ fontSize: "20px" }} />
                                    <span className="text-[11px] font-bold ml-1 text-gray-700">COD</span>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Integrated PricingCard with Checkout CTA */}
                    <PricingCard
                        subtotal={1399}
                        discount={600}
                        shippingFee={0}
                        platformFee={0}
                        buttonText="Checkout"
                        showWishlistCard={false}
                        showTrustBadges={true}
                        onBuyNow={handleCheckout}
                    />
                </div>
            </div>

            {/* Address Modal Dialog */}
            <AddressForm
                open={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddAddress={handleAddAddress}
            />
        </div>
    );
};

export default AddressDetail;

import React, { useState } from "react";
import { Button } from "@mui/material";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import AddressForm, { type Address } from "../Checkout/AddressForm";

const INITIAL_SAVED_ADDRESSES: Address[] = [
    {
        id: "1",
        name: "Ashok Singh",
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
        name: "Ashok Singh (Office)",
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

const Addresses: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_SAVED_ADDRESSES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddAddress = (newAddr: Address) => {
        setAddresses((prev) => [newAddr, ...prev]);
    };

    const handleDelete = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        Saved Addresses
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage your delivery addresses
                    </p>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add fontSize="small" />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        color: teal[700],
                        borderColor: teal[600],
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                        textTransform: "uppercase",
                        px: 2,
                        "&:hover": { borderColor: teal[800], bgcolor: "rgba(13, 148, 136, 0.05)" },
                    }}
                >
                    Add Address
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-white shadow-xs space-y-2 relative"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">{addr.name}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                    {addr.addressType || "HOME"}
                                </span>
                                {addr.isDefault && (
                                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50">
                                        Default
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => handleDelete(addr.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete address"
                            >
                                <DeleteOutlined fontSize="small" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed">
                            {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.pinCode}
                        </p>

                        <p className="text-xs text-gray-700 font-medium">
                            <strong>Mobile: </strong>{addr.mobile}
                        </p>
                    </div>
                ))}
            </div>

            <AddressForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddAddress={handleAddAddress}
            />
        </div>
    );
};

export default Addresses;

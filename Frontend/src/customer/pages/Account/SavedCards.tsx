import React from "react";
import { CreditCardOutlined, Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { teal } from "@mui/material/colors";

const SavedCards: React.FC = () => {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        Saved Cards
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage your saved credit and debit cards
                    </p>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add fontSize="small" />}
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
                    Add Card
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sample Card 1 */}
                <div className="p-5 rounded-xl border border-gray-200 bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold tracking-wider uppercase text-gray-300">HDFC Bank</span>
                        <CreditCardOutlined sx={{ fontSize: "20px", color: teal[400] }} />
                    </div>
                    <p className="text-base font-mono tracking-widest pt-2">•••• •••• •••• 4821</p>
                    <div className="flex justify-between items-end text-xs text-gray-300">
                        <div>
                            <span className="text-[10px] uppercase block text-gray-400">Card Holder</span>
                            <span className="font-semibold text-white">ASHOK SINGH</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase block text-gray-400">Expires</span>
                            <span className="font-semibold text-white">08/29</span>
                        </div>
                    </div>
                </div>

                {/* Sample Card 2 */}
                <div className="p-5 rounded-xl border border-gray-200 bg-linear-to-br from-teal-900 to-teal-800 text-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold tracking-wider uppercase text-teal-200">ICICI Bank</span>
                        <CreditCardOutlined sx={{ fontSize: "20px", color: teal[200] }} />
                    </div>
                    <p className="text-base font-mono tracking-widest pt-2">•••• •••• •••• 9104</p>
                    <div className="flex justify-between items-end text-xs text-teal-200">
                        <div>
                            <span className="text-[10px] uppercase block text-teal-300">Card Holder</span>
                            <span className="font-semibold text-white">ASHOK SINGH</span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase block text-teal-300">Expires</span>
                            <span className="font-semibold text-white">11/28</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedCards;

import { useState } from "react";
import { Button } from "@mui/material";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./CreateDealForm";

const tabs = [
    "Deals",
    "Category",
    "Create Deal",
];

const Deal = () => {
    const [selectedTab, setSelectedTab] = useState("Deals");

    return (
        <div>
            <div className="flex gap-4">
                {tabs.map((item, index) => (
                    <Button
                        key={index}
                        variant={selectedTab === item ? "contained" : "outlined"}
                        onClick={() => setSelectedTab(item)}
                    >
                        {item}
                    </Button>
                ))}
            </div>

            <div className="mt-5">
                {selectedTab === "Deals" ? (
                    <DealTable />
                ) : selectedTab === "Category" ? (
                    <DealCategoryTable />
                ) : (
                    <div>
                        <CreateDealForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deal;
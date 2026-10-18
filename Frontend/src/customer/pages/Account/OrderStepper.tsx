import React from "react";
import { Box } from "@mui/material";
import {
    CheckCircle,
    CancelOutlined,
} from "@mui/icons-material";

export interface StepItem {
    name: string;
    description: string;
    value: string;
}

export const steps: StepItem[] = [
    { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
    { name: "Packed", description: "Item Packed in Dispatch Warehouse", value: "CONFIRMED" },
    { name: "Shipped", description: "by Mon, 15 Jul", value: "SHIPPED" },
    { name: "Arriving", description: "by 16 Jul - 18 Jul", value: "ARRIVING" },
    { name: "Order Delivered", description: "by 16 Jul - 18 Jul", value: "DELIVERED" },
];

export const canceledStep: StepItem[] = [
    { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
    { name: "Order Canceled", description: "on Thu, 11 Jul", value: "CANCELLED" },
];

interface OrderStepperProps {
    orderStatus?: string;
    currentStep?: number;
}

const OrderStepper: React.FC<OrderStepperProps> = ({
    orderStatus = "SHIPPED",
    currentStep,
}) => {
    const isCanceled = orderStatus === "CANCELLED";
    const activeSteps = isCanceled ? canceledStep : steps;

    // Determine current step index
    const resolvedStepIndex =
        currentStep !== undefined
            ? currentStep
            : isCanceled
            ? 1
            : activeSteps.findIndex((s) => s.value === orderStatus) !== -1
            ? activeSteps.findIndex((s) => s.value === orderStatus)
            : 2; // Default to 'SHIPPED' index

    const isDelivered = !isCanceled && (orderStatus === "DELIVERED" || resolvedStepIndex >= activeSteps.length - 1);

    return (
        <Box className="my-2">
            <div className="flex flex-col">
                {activeSteps.map((step, index) => {
                    const isCompleted = isDelivered
                        ? index <= resolvedStepIndex
                        : index < resolvedStepIndex || (index === resolvedStepIndex && step.value === "DELIVERED");
                    const isCurrent =
                        isDelivered || step.value === "DELIVERED"
                            ? false
                            : index === resolvedStepIndex;
                    const isLast = index === activeSteps.length - 1;

                    let lineClass = "bg-gray-200";
                    if (isCanceled && isCurrent) {
                        lineClass = "bg-red-400";
                    } else if (isCompleted) {
                        lineClass = "bg-teal-600";
                    }

                    return (
                        <div key={step.name} className="flex items-start gap-4 relative">
                            {/* Left indicator column with line */}
                            <div className="flex flex-col items-center">
                                {/* Dot / Check Icon */}
                                {isCanceled && isCurrent ? (
                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 z-10">
                                        <CancelOutlined sx={{ fontSize: "20px" }} />
                                    </div>
                                ) : isCompleted ? (
                                    <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white z-10 shadow-xs">
                                        <CheckCircle sx={{ fontSize: "18px" }} />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="w-7 h-7 rounded-full bg-teal-50 border-2 border-teal-600 flex items-center justify-center z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gray-50 border-2 border-gray-300 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                    </div>
                                )}

                                {/* Connecting vertical line */}
                                {!isLast && (
                                    <div
                                        className={`w-0.5 min-h-[46px] my-1 transition-colors duration-300 ${lineClass}`}
                                    />
                                )}
                            </div>

                            {/* Right content column */}
                            <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-sm ${
                                            isCanceled && isCurrent
                                                ? "font-bold text-red-600"
                                                : isCurrent
                                                ? "font-bold text-teal-900"
                                                : isCompleted
                                                ? "font-semibold text-gray-800"
                                                : "font-medium text-gray-400"
                                        }`}
                                    >
                                        {step.name}
                                    </span>

                                    {/* Active pill indicator */}

                                    {isCurrent && !isCanceled && (
                                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            Current
                                        </span>
                                    )}

                                    {isCanceled && isCurrent && (
                                        <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            Cancelled
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mt-0.5 font-normal leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Box>
    );
};

export default OrderStepper;

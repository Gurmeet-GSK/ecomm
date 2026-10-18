import { Button, Card, Divider } from "@mui/material";
import TransactionTable from "./Transaction";

const Payment =() =>{
        return (
        <div className="">
            <Card className="rounded-md space-y-4 p-4" >
                <h1 className="text-gray-600 font-medium">Total Earning</h1>
                <h1 className="font-bold text-3xl pb-1">Rs. 11644</h1>
                <Divider/>
                <p className="text-gray-600 font-medium pt-1">Last Payment : <strong>Rupees 0</strong></p>

            </Card>
            <div className="flex justify-between items-center pt-20">
                <h1 className="text-xl font-bold mb-5">All Payment Details</h1>
                <Button variant="contained" >
                    Transaction
                </Button>
            </div>

            <TransactionTable/>
            
        </div>
    )
}

export default Payment;
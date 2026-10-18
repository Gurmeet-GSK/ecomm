import { Close, Remove } from "@mui/icons-material"
import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, IconButton } from "@mui/material"

const CartItem = () => {
    const handleUpdateQuantity = () => {
        // update cart item quantity
    }

    return (
        <div className="border rounded-md relative p-5">
            <div className="flex gap-4">
                <div>
                    <img 
                        className="w-[90px] h-[90px] object-cover rounded-md" 
                        src="https://i.pinimg.com/1200x/23/67/e5/2367e55711f6ade916ff7805700b942f.jpg" 
                        alt="Product" 
                    />
                </div>
                <div className="space-y-1 flex-1">
                    <h1 className="font-semibold text-lg">Product_name</h1>
                    <p className="text-gray-600 font-medium text-sm">Product_description</p>
                    <p className="text-gray-400 text-xs"><strong>Sold by: </strong>Company_name</p>
                    <p className="text-xs text-gray-500">7 days replacement available</p>
                    <p className="text-sm text-gray-500"><strong>Quantity: </strong>5</p>
                </div>
            </div>

            <Divider className="!my-4" />

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ minWidth: 32, p: '4px' }} 
                        onClick={handleUpdateQuantity} 
                        disabled={true}
                    >
                        <Remove fontSize="small" />
                    </Button>
                    <span className="px-3 font-semibold text-sm">5</span>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ minWidth: 32, p: '4px' }} 
                        onClick={handleUpdateQuantity}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                </div>

                <div className="text-sm font-semibold">
                    <span>₹799</span>
                </div>
            </div>

            <div className="absolute top-2 right-2">
                <IconButton size="small">
                    <Close fontSize="small" />
                </IconButton>
            </div>
            
        </div>
    )
}

export default CartItem
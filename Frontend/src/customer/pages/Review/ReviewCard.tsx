
import { Delete } from "@mui/icons-material";
import { Avatar, Box, IconButton, Rating } from "@mui/material";
import { red } from "@mui/material/colors";

const ReviewCard = () => {
    return (
        <div className="flex justify-between gap-4 p-2">
            <div className="flex gap-4">
                <Box>
                    <Avatar className="text-white" sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}>
                        AK
                    </Avatar>
                </Box>

                <div className="space-y-2">
                    <p className="font-semibold text-lg">John Doe</p>
                    <p className="opacity-70">2024-09-27T14:31:40.628Z</p>
                    <p className="opacity-70">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quod.</p>
                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
                    <p>The quality of the product does match with the price. I'm not satisfied with the product.</p>
                    <div>
                        <img className="h-24 w-24 object-cover" src="https://i.pinimg.com/1200x/27/9b/13/279b13ae1af8767ad0fa6cc32bc89626.jpg" alt="" />
                    </div>
                </div>
            </div>

            <div>
                <IconButton>
                    <Delete sx={{ color: red[700] }} />
                </IconButton>
            </div>
        </div>
    );
};

export default ReviewCard;
import { AddShoppingCart, FavoriteBorder, LocalShipping, Remove, Shield, Wallet, WorkspacePremium } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import { Button, Divider } from '@mui/material';
import { teal } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import SimilarProduct from './SimilarProduct';
import ReviewCard from '../Review/ReviewCard';

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    return (
        <div className="px-5 lg:px-20 pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex w-full lg:w-[15%] flex-wrap lg:flex-col gap-3">
                        {[1, 1, 1, 1, 1].map((_, index) => (
                            <img
                                key={index}
                                className="lg:w-full w-[50px] cursor-pointer rounded-md"
                                src="https://i.pinimg.com/1200x/27/9b/13/279b13ae1af8767ad0fa6cc32bc89626.jpg"
                                alt=""
                            />
                        ))}
                    </div>
                    <div className="w-full lg:w-[85%]">
                        <img
                            className="w-full rounded-lg shadow-lg"
                            src="https://i.pinimg.com/1200x/23/67/e5/2367e55711f6ade916ff7805700b942f.jpg"
                            alt=""
                        />
                    </div>
                </section>

                <section>
                    <h1 className="font-bold text-lg text-primary-color">Clothing Brand</h1>
                    <p className="text-gray-500 font-semibold">black color t shirt</p>
                    <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-3">
                        <div className="flex gap-1 items-center">
                            <span>4</span>
                            <StarIcon sx={{ color: teal[500], fontSize: "17px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <span>123 Ratings</span>
                    </div>
                    <div>
                        <div className="price flex items-center gap-3 mt-5 text-2xl">
                            <span className="font-sans text-gray-800">₹500</span>
                            <span className="line-through text-gray-400">₹1000</span>
                            <span className="text--primary-color font-semibold">60%</span>
                        </div>
                        <p className="text-sm mt-2 text-green-500 font-semibold">Inclusive of all taxes. Free Shipping above ₹1500</p>
                    </div>
                    <div className="mt-7 space-y-3">
                        <div className='flex itmes-center gap-4'>
                            <Shield sx={{ color: teal[500] }} />
                            <p>Authentic Original product</p>
                        </div>

                        <div className='flex itmes-center gap-4'>
                            <WorkspacePremium sx={{ color: teal[500] }} />
                            <p>10 Days Return Policy</p>
                        </div>

                        <div className='flex itmes-center gap-4'>
                            <LocalShipping sx={{ color: teal[500] }} />
                            <p>Free Shipping</p>
                        </div>

                        <div className='flex itmes-center gap-4'>
                            <Wallet sx={{ color: teal[500] }} />
                            <p>Cash on Delivery is available</p>
                        </div>
                    </div>
                    <div className='mt-7 space-y-2'>
                        <h1>Quantity</h1>
                        <div className='flex items-center gap-2 w-[140px] justify-between'>
                            <Button disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>
                                <Remove />
                            </Button>
                            <span>{quantity}</span>
                            <Button onClick={() => setQuantity(quantity + 1)}>
                                <AddIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex mt-7 items-center gap-5">
                        <Button fullWidth startIcon={<AddShoppingCart />} variant="contained" sx={{ py: "1rem", mt: "2rem" }}>
                            Add to Cart
                        </Button>
                        <Button fullWidth startIcon={<FavoriteBorder />} variant="outlined" sx={{ py: "1rem", mt: "2rem" }}>
                            Wishlist
                        </Button>
                    </div>

                    <div className="mt-5">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, nisi.
                        </p>
                    </div>

                    <div className='mt-12 space-y-5'>
                        <ReviewCard />
                        <Divider />
                    </div>
                </section>
            </div>

            <div className='mt-10'>
                <h1 className='text-lg font-bold text-center justify-center'>Similar Products</h1>
                <div className='flex justify-between items-center mt-5'>
                    <SimilarProduct />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
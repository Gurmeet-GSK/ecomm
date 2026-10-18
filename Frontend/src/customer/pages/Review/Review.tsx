import { Divider } from "@mui/material";
import ReviewCard from "./ReviewCard";

const Review = () => {
    return (
        <div className="p-5 lg:px-20 flex flex-col lg:flex-row gap-20">
            <section className="w-full md:w-1/2 lg:w-[30%] space-y-10 ">
                <img src="https://i.pinimg.com/736x/43/0d/ee/430dee7c12965d2ee88cbde0cdea7671.jpg" alt="" />
                <div>
                    <div className="space-y-1">
                        <p className="font-bold text-xl">Rochèster</p>
                        <p className="text-lg text-gray-600">Men'White Shirt</p>
                    </div>

                    <div>
                        <div className="price flex items-center gap-3 mt-5 text-2xl">
                            <span className="font-sans text-gray-800">₹500</span>
                            <span className="line-through text-gray-400">₹1000</span>
                            <span className="text--primary-color font-semibold">60%</span>
                        </div>
                        <p className="text-sm mt-2 text-green-500 font-semibold">Inclusive of all taxes. Free Shipping above ₹1500</p>
                    </div>
                </div>
            </section>
            <section className="space-y-5 w-full">
                {[1, 1, 1, 1, 1].map((_, index) => (
                    <div key={index} className="space-y-3">
                        <ReviewCard />
                        <Divider />
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Review;
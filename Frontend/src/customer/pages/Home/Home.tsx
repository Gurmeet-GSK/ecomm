
import ElectricCategory from "./ElectricCategory/ElectricCategory";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import Deal from "./Deal/Deal";
import ShopByCategory from "./ShopByCategory/ShopByCategory";
import { Storefront } from "@mui/icons-material";
import { Button } from "@mui/material";

const Home = () => {
    return (
        <>
            <div className="space-y-5 lg:space-y-10 relative pb-20">
                <ElectricCategory />
                <CategoryGrid />
                <div className="pt-20">
                    <h1 className="text-lg lg:text-4xl text-primary-color font-bold pb-5 lg:pb-20 text-center">TODAY'S DEAL</h1>
                    <Deal />
                </div>
                
                <section className="pt-20">
                    <h1 className="text-lg lg:text-4xl text-primary-color font-bold pb-5 lg:pb-20 text-center">SHOP BY CATEGORY</h1>
                    <ShopByCategory />
                </section>

                <section className=" mt-20  lg:px-20 relative h-[200px] lg:h-[450px] object-cover">
                    <img src="https://i.pinimg.com/1200x/8f/67/45/8f674539752cd80b9b39f1b11cf70982.jpg" alt="" />
                    <div className="absolute top-1/2 left-4 lg:left-[15rem] transform-translate-y-1/2 font-semibold lg:text-4xl space-y-3">
                    <h2>Sell Your Products</h2>
                    <p className="text-lg md:text-2xl ">With 
                    <span className="logo font-bold text-4xl">   Black Mason</span></p>
                    
                    <div className="pt-6 flex justify-center">
                        <Button startIcon={<Storefront/>} variant="contained" size="large">Start Selling</Button>
                    </div>
                    </div>
                    
                </section>


            </div>
        </>
    );
};

export default Home;
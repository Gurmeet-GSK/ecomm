import ShopByCategoryCard from "./ShopByCategoryCard";


const ShopByCategory = () => {
    return (
        <div className="flex justify-between flex-wrap gap-7 px-5 lg:px-20">
           {[1,1,1,1,1,1,1,1,1,1,1,11,1,1,1,1,1,1].map((_item)=> <ShopByCategoryCard/>)}
        </div>
    );
};

export default ShopByCategory;
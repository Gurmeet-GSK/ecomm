import "../ShopByCategory/ShopByCategory.css"

const ShopByCategoryCard = () => {
    return (
        <div className=" flex gap-3 flex-col justify-center items-center group cursor-pointer">
            <div className="custom-border w-[150px] h-[150px] lg:w-[249px] lg:h-[249px] bg-primary-color rounded-full">
                <img className="rounded-full group-hover:scale-95 tansiotion-transform transform-duration-700 object-cover object-top h-full w-full" src="https://i.pinimg.com/736x/ca/8a/4a/ca8a4ad30f698a6594555e6fcbe0ebfd.jpg" alt="" />
            </div>
            <h1>Electronics</h1>
        </div>
    );
};

export default ShopByCategoryCard;
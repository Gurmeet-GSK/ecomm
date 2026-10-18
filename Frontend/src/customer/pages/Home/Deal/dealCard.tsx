

const DealCard = () => {
    return(
        <div className="w-52 cursor-pointer">
            <img className="border-x-[7px] border-t-[7px] border-pink-600 object-cover object-top" src="https://i.pinimg.com/1200x/22/7c/b7/227cb70fafcf903e973fa20732ab1b79.jpg" alt="" />
            <div className="border-4 border-black bg-black text-white p-2 text-center">
                <p className="text-lg font-semibold">Smart Watch</p>
                <p className="text-2xl font-bold"> 20% OFF</p>
                <p className="text-balance text-lg">Shop Now</p>
            </div>
        </div>
    )
}

export default DealCard; 
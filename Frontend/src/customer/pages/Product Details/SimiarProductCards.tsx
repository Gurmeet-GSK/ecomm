const SimilarProductCards= () => {
    return (
        <div>
            <div className="group px-4 relative">
            <div className="card">

                <img className="card-media object-top" src="https://i.pinimg.com/736x/57/72/8f/57728ff4108cf5cd97161eb12767c6d7.jpg" alt="" 
                />  
            </div>

            <div className="space-y-1 group-hover-effect rounded-md details pt-3">
                <div className="name"> 
                    <h1>Niky</h1>
                    <p>Blue Shirt</p>
                </div>

                <div className="price flex items-center gap-3">
                    <span className="font-sans text-gray-800">₹500</span>
                    <span className="thin line-through text-gray-400">₹1000</span>
                    <span className="text--primary-color font-semibold">60%</span>
                </div>

            </div>
        </div>
        </div>
    );
};

export default SimilarProductCards;
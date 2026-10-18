import { useEffect, useState } from "react";
import "./ProductCard.css";
import { Button } from "@mui/material";
import { Favorite, ModeComment } from "@mui/icons-material";
import { teal } from "@mui/material/colors";

    const images = [
        "https://i.pinimg.com/736x/57/72/8f/57728ff4108cf5cd97161eb12767c6d7.jpg",
        "https://i.pinimg.com/736x/3b/68/97/3b689777a57f98ea781d20f05f7f79cf.jpg",
        "https://i.pinimg.com/736x/9b/f6/ab/9bf6abf92259760be41fa9258cee889b.jpg",
        "https://i.pinimg.com/736x/fa/d0/cd/fad0cd8b7713af57e58ce73256dd5ae5.jpg"
    ]

const ProductCard = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let interval: number | undefined;
        if (isHovered) {
            interval = window.setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % images.length);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered]);

    return (
        <>
        <div className="group px-4 relative">
            <div className="card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

                {images.map((item, index) => (
                    <img
                        className="card-media object-top"
                        key={index}
                        src={item}
                        alt=""
                        style={{
                            transform: `translateX(${(index - currentImage + 1) * 100}%)`,
                            opacity: index === currentImage ? 1 : 0.5,
                        }}
                    />
                ))}

                { isHovered &&
                    <div className='indicator flex flex-col items-center space-y-2'>
                        <div className="gap-3 flex">
                            <Button variant="contained" color='secondary'>
                                <Favorite sx={{color:teal[500]}}/>
                            </Button>

                            <Button variant="contained" color='secondary'>
                                <ModeComment sx={{color:teal[500]}}/>
                            </Button>
                        </div>
                    </div>
                }

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
        </>
    );
};

export default ProductCard;   
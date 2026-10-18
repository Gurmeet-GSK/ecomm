
import DealCard from "./dealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderComponent from "react-slick";

// Handle CJS/ESM interop where default might be { default: Component }
const Slider = ((SliderComponent as unknown as { default?: typeof SliderComponent }).default || SliderComponent) as typeof SliderComponent;

const Deal = () => {
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 5,
        speed: 500,
    };

    return (
        <div className="py-5 lg:px-20">
            <Slider {...settings}>
                {[1, 1, 1, 1, 1, 1].map((_, index) => (
                    <DealCard key={index} />
                ))}
            </Slider>
        </div>
    );
};

export default Deal;
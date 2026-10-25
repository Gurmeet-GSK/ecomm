
import DealCard from "./dealCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderComponent from "react-slick";
import { useAppSelector } from "../../../../State/Store";

// Handle CJS/ESM interop where default might be { default: Component }
const Slider = ((SliderComponent as unknown as { default?: typeof SliderComponent }).default || SliderComponent) as typeof SliderComponent;

const Deal = () => {
    const {customer} =  useAppSelector(store=>store)


    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 5,
        speed: 500,
    };

    const deals = customer.homePageData?.topDeals || customer.homePageData?.deals || [];

    return (
        <div className="py-5 lg:px-20">
            <Slider {...settings}>
                {deals.slice(0,6).map((item: any) => (   
                    <DealCard key={item.id} item={item}/>
                ))}
            </Slider>
        </div>
    );
}

export default Deal;
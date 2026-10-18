import SimilarProductCards from "./SimiarProductCards";

const SimilarProduct = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 justify-between gap-4 gap-y-8">
            {Array.from({ length: 12 }).map((_, index) => (
                <SimilarProductCards key={index} />
            ))}
        </div>
    );
};

export default SimilarProduct;
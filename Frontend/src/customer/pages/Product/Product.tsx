import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    useMediaQuery,
    useTheme
} from "@mui/material";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";
import { FilterAlt, RemoveShoppingCartOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchAllProducts } from "../../../State/customer/ProductSlice";

const Product = () => {
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const [sort, setSort] = useState<string>("");
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { category } = useParams();
    const { products, loading, totalPages } = useAppSelector((store) => store.product);

    const formattedCategory = (category || "All Products").replace(/_/g, " ");

    const handleSortChange = (event: any) => {
        setSort(event.target.value ?? "");
    };

    const handlePageChange = (value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
        const color = searchParams.get("color");
        const minDiscount = searchParams.get("discount") ? Number(searchParams.get("discount")) : undefined;
        const pageNumber = Math.max(0, page - 1);

        const newFilter: Record<string, any> = {
            pageNumber,
        };

        if (category && category !== "all") {
            newFilter.category = category;
        }
        if (color) {
            newFilter.color = color;
        }
        if (minPrice) {
            newFilter.minPrice = Number(minPrice);
        }
        if (maxPrice) {
            newFilter.maxPrice = Number(maxPrice);
        }
        if (minDiscount !== undefined) {
            newFilter.minDiscount = minDiscount;
        }
        if (sort) {
            newFilter.sort = sort;
        }

        dispatch(fetchAllProducts(newFilter));
    }, [category, searchParams, page, sort, dispatch]);

    return (
        <div className="-z-10 mt-10">
            <div>
                <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase tracking-wider">
                    {formattedCategory}
                </h1>
            </div>

            <div className="lg:flex">
                <section className="filter_section lg:block hidden w-[20%]">
                    <FilterSection />
                </section>

                <div className="w-full lg:w-[80%] space-y-5">
                    <div className="flex justify-between items-center px-9 h-10">
                        <div className="relative w-[50%]">
                            {isLarge && (
                                <IconButton>
                                    <FilterAlt />
                                </IconButton>
                            )}
                            {!isLarge && (
                                <Box>
                                    <FilterSection />
                                </Box>
                            )}
                        </div>

                        <FormControl size="small" sx={{ width: "200px" }}>
                            <InputLabel id="product-sort-label">Sort</InputLabel>
                            <Select
                                labelId="product-sort-label"
                                id="product-sort-select"
                                value={sort ?? ""}
                                label="Sort"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="">Default</MenuItem>
                                <MenuItem value="price_low">Price: Low - High</MenuItem>
                                <MenuItem value="price_high">Price: High - Low</MenuItem>
                                <MenuItem value="popularity">Popularity</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <Divider />

                    {loading ? (
                        <div className="flex justify-center items-center h-80">
                            <CircularProgress sx={{ color: "#00897b" }} />
                        </div>
                    ) : products && products.length > 0 ? (
                        <section className="product_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
                            {products.map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </section>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                                <RemoveShoppingCartOutlined sx={{ fontSize: 40 }} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
                            <p className="text-gray-500 max-w-md mb-6">
                                We couldn't find any products in the "{formattedCategory}" category at this time. Try exploring other categories or check back later!
                            </p>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/")}
                                sx={{
                                    backgroundColor: "#00897b",
                                    "&:hover": { backgroundColor: "#00695c" },
                                    textTransform: "none",
                                    px: 4,
                                    py: 1.2,
                                }}
                            >
                                Explore Other Products
                            </Button>
                        </div>
                    )}

                    {products && products.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center pt-10 pb-3">
                            <Pagination
                                page={page}
                                onChange={(_e, value) => handlePageChange(value)}
                                count={totalPages || 1}
                                variant="outlined"
                                color="primary"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;

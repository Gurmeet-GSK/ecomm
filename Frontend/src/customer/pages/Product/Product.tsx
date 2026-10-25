import { Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, useMediaQuery, useTheme } from "@mui/material";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";
import { FilterAlt } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAllProducts } from "../../../State/customer/ProductSlice";
const Product = () => {
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { category } = useParams();
    const products = useAppSelector((store) => store.product.products);

    const handleSortChange = (event: any) => {
        setSort(event.target.value);
    };

    const handlePageChange = (value: any) => {
        setPage(value);
    };

    useEffect(() => {
        const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
        const color = searchParams.get("color");
        const minDiscount = searchParams.get("discount") ? Number(searchParams.get("discount")) : undefined;
        const pageNumber = page - 1;

        const newFilter = {
            category: category || "",
            color: color || "",
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            minDiscount,
            pageNumber,
            sort: sort || "",
        };

        dispatch(fetchAllProducts(newFilter));
    }, [category, searchParams, page, sort, dispatch]);

    return (
        <div className="-z-10 mt-10">
            <div>
                <h1 className="text-3xl text-center font-bold text-gray-500 pb-5 px-9 uppercase space-x-2">MASON</h1>
            </div>

            <div className="lg:flex">

                <section className="filter_section lg:block hidden w-[20%]">
                    <FilterSection />
                </section>

                <div className="w-full lg:w-[80%] space-y-5">
                    <div className="flex justify-between items-center px-9 h-10" >
                        <div className="relative w-[50%]">
                            {
                                isLarge && (<IconButton>
                                    <FilterAlt />
                                </IconButton>)
                            }
                            {
                                !isLarge && (
                                    <Box>
                                        <FilterSection />
                                    </Box>)
                            }

                        </div>

                        <FormControl size="small" sx={{ width: "200px" }}>
                            <InputLabel id="demo-simple-select-label">Sort</InputLabel>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sort}
                                label="Age"
                                onChange={handleSortChange}
                            >
                                <MenuItem value="price_low">Price: Low - High</MenuItem>
                                <MenuItem value="price_high">Price: High - Low</MenuItem>
                                 <MenuItem value={30}>Popularity</MenuItem>

                            </Select>
                        </FormControl>

                    </div>
                    <Divider />
                    <section className="product_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
                        {products?.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
 
                    </section>
                    <div className="flex justify-center pt-10 pb-3" >
                        <Pagination
                            page={page}
                            onChange={(_e, value) => handlePageChange(value)}
                            count={10}
                            variant="outlined"
                            color="primary" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Product;   
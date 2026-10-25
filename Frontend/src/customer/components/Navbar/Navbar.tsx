import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { AccountCircleRounded } from "@mui/icons-material";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../State/Store";

const TEAL = "#00897b";
const TEAL_DARK = "#00695c";

// id must match the keys used in CategorySheet.tsx
const links = [
  { label: "Men", id: "men" },
  { label: "Women", id: "women" },
  { label: "Home & Furniture", id: "home_furniture" },
  { label: "Electronics", id: "electronics" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const navigate = useNavigate()

  const auth = useAppSelector((state) => state.auth);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isLoggedIn = auth.isLoggedIn;
  const isLarge = true;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-10">
        {/* Left: menu icon (mobile only), title, links (desktop only) */}
        <div className="flex h-full items-center gap-2 md:gap-15">
          <div className="md:hidden">
            {!isLarge && (
              <IconButton
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </div>

          <h1 onClick={()=>navigate("/")} className="cursor-pointer text-lg font-extrabold uppercase tracking-tight text-gray-900 md:text-2xl">
            Black Mason
          </h1>

          {/* Desktop links as an unordered list */}
          <nav className="hidden h-full md:block">
            <ul className="flex h-full items-center gap-8">
              {links.map((link) => {
                // keeps the underline on while this category's sheet is open
                const isActive = showSheet && selectedCategory === link.id;

                return (
                  <li
                    key={link.id}
                    className="flex h-full items-center"
                    onMouseEnter={() => {
                      setSelectedCategory(link.id);
                      setShowSheet(true);
                    }}
                    onMouseLeave={() => setShowSheet(false)}
                  >
                    <a
                      href="#"
                      className={`relative inline-block py-1 text-sm font-medium transition-colors duration-300 ${
                        isActive ? "text-[#00897b]" : "text-gray-700"
                      }`}
                    >
                      {link.label}
                      {/* Underline that grows from left to right */}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#00897b] transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: search, login/profile, wishlist, cart, become seller */}
        <div className="flex items-center gap-2 md:gap-5">
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>

          {isLoggedIn ? (
            <Button onClick={() => navigate("/account/orders")}
              className="flex items-center gap-2"
              sx={{ color: "#111827", textTransform: "none" }}
            >
              <Avatar
                sx={{ width: 29, height: 29 }}
                src="https://i.pinimg.com/474x/23/7b/ef/237bef165970536a461db1b78fb3d1a9.jpg"
              />
              <span className="hidden font-semibold lg:block">
                {auth.user?.fullName?.split(" ")[0] || "Account"}
              </span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              startIcon={<AccountCircleRounded />}
              sx={{
                backgroundColor: TEAL,
                boxShadow: "none",
                "&:hover": { backgroundColor: TEAL_DARK, boxShadow: "none" },
              }}
            >
              Login
            </Button>
          )}

          <IconButton onClick={()=>navigate("/wishlist")} aria-label="Wishlist">
            <Badge badgeContent={wishlist?.products?.length || 0} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={()=>navigate("/cart")} aria-label="Cart">
            <ShoppingCartOutlinedIcon />
          </IconButton>

          <div className="hidden md:block">
            <Button
              onClick={() => navigate("/become-seller")}
              variant="outlined"
              startIcon={<StorefrontOutlinedIcon />}
              sx={{
                color: TEAL,
                borderColor: TEAL,
                "&:hover": { borderColor: TEAL_DARK, backgroundColor: "#e0f2f1" },
              }}
            >
              Become Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Category sheet: sits right under the navbar and slides down when open */}
      <div
        onMouseEnter={() => setShowSheet(true)}
        onMouseLeave={() => setShowSheet(false)}
        className={`categorySheet absolute left-20 right-20 top-full hidden max-h-[70vh] overflow-y-auto rounded-b-md border border-gray-200 bg-white shadow-lg transition-all duration-300 md:block ${
          showSheet
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        <CategorySheet selectedCategory={selectedCategory} />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-gray-200 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.id}>
                <a href="#" className="text-sm font-medium text-gray-700">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button
                variant="outlined"
                startIcon={<StorefrontOutlinedIcon />}
                sx={{ color: TEAL, borderColor: TEAL }}
              >
                Become Seller
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
import { useNavigate } from "react-router-dom";
import { menLevelTwo } from "../../../data/category/levelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/levelTwo/womenLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/levelTwo/electronicsLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/levelTwo/furnitureLevelTwo";
import { menLevelThree } from "../../../data/category/levelThree/menLevelThree";
import { womenLevelThree } from "../../../data/category/levelThree/womenLevelThree";
import { electronicsLevelThree } from "../../../data/category/levelThree/electronicsLevelThree";
import { furnitureLevelThree } from "../../../data/category/levelThree/furnitureLevelThree";

type CategoryItem = {
  name: string;
  categoryId: string;
  parentCategoryId: string;
  level: number;
};

// Level two = bold column headings, level three = the light items under each heading
const categoryTwo: Record<string, CategoryItem[]> = {
  men: menLevelTwo,
  women: womenLevelTwo,
  electronics: electronicsLevelTwo,
  home_furniture: furnitureLevelTwo,
};

const categoryThree: Record<string, CategoryItem[]> = {
  men: menLevelThree,
  women: womenLevelThree,
  electronics: electronicsLevelThree,
  home_furniture: furnitureLevelThree,
};

type Props = { 
  selectedCategory: string; // "men", "women", "electronics" or "home_furniture"
  onClose?: () => void;
};

const CategorySheet = ({ selectedCategory, onClose }: Props) => {
  const navigate = useNavigate();
  const headings = categoryTwo[selectedCategory] ?? [];
  const items = categoryThree[selectedCategory] ?? [];

  const handleCategoryClick = (categoryId: string) => {
    if (onClose) onClose();
    navigate(`/products/${categoryId}`);
  };

  return (
    <div className="grid grid-cols-5">
      {headings.map((heading, index) => (
        <div
          key={heading.categoryId}
          // alternate shaded and white columns
          className={`px-6 py-6 ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
        >
          <h3
            onClick={() => handleCategoryClick(heading.categoryId)}
            className="mb-4 text-sm font-semibold text-[#00897b] cursor-pointer hover:underline"
          >
            {heading.name}
          </h3>

          <ul className="flex flex-col gap-1.5">
            {items
              .filter((item) => item.parentCategoryId === heading.categoryId)
              .map((item) => (
                <li
                  key={item.categoryId}
                  onClick={() => handleCategoryClick(item.categoryId)}
                  className="cursor-pointer text-sm text-gray-600 transition-colors hover:text-[#00897b]"
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategorySheet; 
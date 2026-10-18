import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { teal } from "@mui/material/colors";
import { colors } from "../../../data/Filter/color";
import { price } from "../../../data/Filter/price";
import { discount } from "../../../data/Filter/discount";
import { brands } from "../../../data/Filter/brand";

type Option = { label: string; value: string; hex?: string };

type FilterGroup = {
  id: string; 
  title: string;
  options: Option[];
};


const filterGroups: FilterGroup[] = [
  {
    id: "color",
    title: "Color",
    options: colors.map((c) => ({ label: c.name, value: c.name, hex: c.hex })),
  },
  {
    id: "price",
    title: "Price",
    options: price.map((p) => ({ label: p.name, value: p.value })),
  },
  {
    id: "discount",
    title: "Discount",
    options: discount.map((d) => ({ label: d.name, value: d.value })),
  },
  {
    id: "brand",
    title: "Brand",
    options: brands.map((b) => ({ label: b.name, value: b.value })),
  },
];

const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const activeCount = filterGroups.filter((g) => searchParams.get(g.id)).length;

  
  const updateFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setSearchParams(params);
  };

  
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    filterGroups.forEach((g) => params.delete(g.id));
    setSearchParams(params);
  };

  return (
    <aside className="bg-white">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-6">
        <p className="text-lg font-semibold text-gray-900">Filters</p>
        <Button
          size="small"
          disabled={activeCount === 0}
          onClick={clearAllFilters}
          sx={{ color: teal[600], fontWeight: 600, textTransform: "none" }}
        >
          Clear all
        </Button>
      </div>

      
      <div className="border-t border-gray-200">
        {filterGroups.map((group) => {
          const isOpen = !!openGroups[group.id];
          const selected = searchParams.get(group.id) ?? "";

          return (
            <div key={group.id} className="border-b border-gray-200">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenGroups({ ...openGroups, [group.id]: !isOpen })
                }
                className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  {group.title}
                  {selected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  )}
                </span>
                <ExpandMoreIcon
                  fontSize="small"
                  className={`text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                
                <div className="max-h-56 overflow-y-auto px-6 pb-4">
                  <RadioGroup
                    name={group.id}
                    aria-label={group.title}
                    value={selected}
                    onChange={(_, value) => updateFilter(group.id, value)}
                  >
                    {group.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                          <Radio
                            size="small"
                            sx={{ "&.Mui-checked": { color: teal[600] } }}
                          />
                        }
                        label={
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span>{option.label}</span>
                            {option.hex && (
                              <span
                                style={{ backgroundColor: option.hex }}
                                className="h-4 w-4 rounded-full border border-gray-300"
                              />
                            )}
                          </div>
                        }
                      />
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default FilterSection;
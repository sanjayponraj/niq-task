import { useContext, useEffect, useState } from "react";
import "./FilterComponent.css";
import Dropdown from "../Dropdown/DropdownComponent";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdownComponent";
import { Button } from "@mui/material";
import { Category, Product, ProductListing } from "../api.interfaces";
import { RunReportCtx } from "../Home/HomeComponent";

function Filter() {
  const [productNames, setProductNames] = useState<string[]>([]);
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>(
    [],
  );
  const {
    categories,
    setCategories,
    products,
    setProducts,
    categoryNames,
    setCategoryNames,
    selectedCategory,
    selectedProducts,
    setSelectedCategory,
    setSelectedProducts,
    setUpdateChart,
    setDisableRunBtn,
    setShowChart,
  } = useContext(RunReportCtx);

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const url = "https://dummyjson.com/products/categories";
    fetchData(url).then((result: Category[]) => {
      setCategories(result);
      const names = result.map((elem: Category) => elem.name);
      setCategoryNames(names);
    });
  }, []);

  useEffect(() => {
    setSelectedProducts([]);
    setSelectedProductNames([]);
    if (selectedCategory) {
      const url = categories.find(
        (category: any) => category.name === selectedCategory,
      )?.url;
      if (url) {
        fetchData(url).then((result: ProductListing) => {
          setProducts(result.products);
          setUpdateChart(true);
          const names = result.products.map((elem: Product) => elem.title);
          setProductNames(names);
        });
      }
    }
  }, [selectedCategory]);

  const handleCategoryChange = (selectedValue: string) => {
    setSelectedCategory(selectedValue);
    setDisableRunBtn(false);
  };

  const handleProductsChange = (selectedValue: string[]) => {
    if (selectedValue[0] === productPlaceholder) {
      setDisableRunBtn(true);
    }
    setSelectedProductNames(selectedValue);
    const selectedProducts: Product[] = [];
    products.forEach((product) => {
      const selectedProduct = selectedValue.find(
        (value) => value === product.title,
      );
      if (selectedProduct) {
        selectedProducts.push(product);
      }
    });
    setSelectedProducts(selectedProducts);
    setDisableRunBtn(false);
  };
  const productPlaceholder = "Select Product";

  return (
    <div className="filter">
      <div className="header">
        <div className="title">Filters</div>
        <div className="clearBtn">
          <Button
            variant="text"
            onClick={() => {
              setSelectedCategory("");
              setSelectedProducts([]);
              setSelectedProductNames([]);
              setShowChart(false);
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="formFields">
        <div className="category">
          <Dropdown
            selectedState={selectedCategory}
            placeholder="Select Category"
            list={categoryNames}
            label="Category"
            handleSelectChange={handleCategoryChange}
          />
        </div>
        <div className="products">
          <MultiSelectDropdown
            selectedState={selectedProductNames}
            placeholder={productPlaceholder}
            list={productNames}
            label="Product"
            disable={!selectedCategory}
            handleMultiSelectChange={handleProductsChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Filter;

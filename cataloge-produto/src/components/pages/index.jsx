import React, { useEffect, useMemo, useState } from "react";
import productData from "./../../products.json";
import { ToastContainer, toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

// normalize product fields coming from products.json
const normalize = (p) => {
  // resolve image paths so they work uniformly whether they are absolute

  let image = p.image || "";
  try {
    if (image && typeof image === "string") {
      if (image.startsWith("/")) {
        // normalize spaces to %20 for safety
        image = image.split(" ").join("%20");
      } else {
        const cleaned = image.replace(/^\//, "");
        image = new URL(`../../../${cleaned}`, import.meta.url).href;
      }
    }
  } catch (e) {
    image = p.image || "";
  }

  return {
    id: p.id,
    name: p.Productname || p.name || "",
    price: p.Price || p.price || "₦0.00",
    description: p.Description || p.description || "",
    image,
    tag: p.tag || "",
  };
};

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSortOption, setFilterSortOption] = useState("all");

  // listen to search events from Nav (custom event)
  useEffect(() => {
    const handleSearchQuery = (e) =>
      setSearchQuery(e && e.detail ? String(e.detail).toLowerCase() : "");
    window.addEventListener("searchQueryChanged", handleSearchQuery);
    return () =>
      window.removeEventListener("searchQueryChanged", handleSearchQuery);
  }, []);

  const products = useMemo(() => productData.map(normalize), []);

  const displayedProducts = useMemo(() => {
    let filtered = [...products];

    // unify option checks to lowercase values
    if (filterSortOption === "new" || filterSortOption === "sale") {
      filtered = filtered.filter((product) => product.tag === filterSortOption);
    }

    if (filterSortOption === "low") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.price.replace(/[₦,]/g, "")) -
          parseFloat(b.price.replace(/[₦,]/g, ""))
      );
    }
    if (filterSortOption === "high") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.price.replace(/[₦,]/g, "")) -
          parseFloat(a.price.replace(/[₦,]/g, ""))
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      );
    }

    return filtered;
  }, [products, filterSortOption, searchQuery]);

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyCart = existing.find((p) => p.id === product.id);
    let updatedCart;
    if (alreadyCart) {
      updatedCart = existing.map((p) =>
        p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.warning(`${product.name} is already in the cart`);
    } else {
      updatedCart = [...existing, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} Added to cart`);
    }
  }
     

  return (
    <>
      <div className="shop-container">
        <div className="container">
          <h1 className="text-dark py-4 fw-semibold">Products</h1>

          <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted" style={{ fontSize: "1.1rem" }}>
                Showing <strong>{displayedProducts.length}</strong> product
                {displayedProducts.length !== 1 && "s"} for{" "}
                <strong>
                  {filterSortOption === "all" ? "All" : filterSortOption}
                </strong>
              </div>
              <div>
                <select
                  className="form-select py-2 fs-6"
                  style={{
                    minWidth: "260px",
                    backgroundColor: "#f5f5f5",
                    border: "0px",
                  }}
                  value={filterSortOption}
                  onChange={(e) => setFilterSortOption(e.target.value)}
                >
                  <option value="all">All PRODUCTS</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="Sale">Sale Product</option>
                  <option value="New">New Products</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            {displayedProducts.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-danger text-center">
                  No products found matching your search
                </div>
              </div>
            ) : (
              displayedProducts.map((product) => (
                <div className="col-md-3 mb-4" key={product.id}>
                  <div className="product-item text-center position-relative">
                    <div className="image-wrapper w-100 position-relative overflow-hidden">
                      <img src={product.image} className="img-fluid"alt=""/>
                      
                      {/* CORRECTION FOR FILTERS SHOULD COME HERE LATER */}
                      <div className="product-icons gap-3">
                        <div
                          className="product-icon"
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart fs-5"></i>
                        </div>
                      </div>
                    {product.tag && (
                      <span className={`tag badge text-white ${product.tag === 'New' ? 'bg-danger' : product.tag === 'Out of stock' ? 'bg-secondary' : product.tag === 'limited' ? 'bg-warning text-dark' : 'bg-primary'}`}>{product.tag}</span>
                    )}
                    </div>
                    <div className="product-content pt-3">
                      {product.oldprice ? (
                          <span className="price">
                              <span className="text-muted text-decoration-line-through me-3">{product.oldprice}</span>
                              <span className="fw-bold text-danger">{product.price}</span>
                          </span>
                      ) : (
                          <span className="price">{product.price}</span>
                      )}
                      <h3 className="title pt-1">{product.name}</h3>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Index;

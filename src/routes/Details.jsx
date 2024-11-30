import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library

export default function ProductDetails() {
  const { product_id } = useParams(); // Use product_id from the URL
  const navigate = useNavigate();
  const apiHost = import.meta.env.VITE_API_HOST;

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log("Fetching product details for ID:", product_id);
        const response = await fetch(`${apiHost}/api/products/${product_id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setStatus("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [apiHost, product_id]);

  // Add to Cart functionality using cookies
  function addProductToCart() {
    try {
      // Get the current cart from cookies
      const cart = Cookies.get("cart");
      const cartItems = cart ? cart.split(",").map(Number) : [];

      // Add the current product ID to the cart
      cartItems.push(parseInt(product_id));

      // Update the cookie with the new cart
      Cookies.set("cart", cartItems.join(","), { expires: 7 }); // Set the cookie to expire in 7 days

      setStatus("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setStatus("An error occurred. Please try again.");
    }
  }

  // Render loading state
  if (loading) {
    return <p>Loading product details...</p>;
  }

  // Render error or missing product
  if (!product) {
    return (
      <div>
        <p>{status || "No product found."}</p>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  // Render product details
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-14">
          <div className="border p-4 rounded" style={{ borderWidth: '4px' }}>  
            <div className="row">
              <div className="col-md-7">
                <img
                  src={`${apiHost}/images/${product.filename}`}
                  alt={product.name}
                  className="img-fluid"
                  style={{ objectFit: "cover", maxHeight: "500px" }}
                />
              </div>
              <div className="col-md-4">
                <h1>{product.name}</h1>
                <h2>${product.cost}</h2>
                <p>{product.description}</p>

                <button className="btn btn-primary me-2" onClick={addProductToCart}>
                  Add to Cart
                </button>

                <button className="btn btn-secondary" onClick={() => navigate("/")}>
                  Go Back
                </button>

                {status && <p className="mt-3 text-success">{status}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

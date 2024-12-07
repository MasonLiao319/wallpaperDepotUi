import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../routes/AuthContext"; 

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [estimatedTax, setEstimatedTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const apiHost = import.meta.env.VITE_API_HOST;
  const TAX_RATE = 0.15; // Estimated tax rate

  useEffect(() => {
    fetchCartFromCookies();
  }, []);

  const fetchCartFromCookies = async () => {
    const cartCookie = Cookies.get("cart");
    if (!cartCookie) {
      setCartItems([]);
      setSubtotal(0);
      setEstimatedTax(0);
      setTotal(0);
      return;
    }

    const productIds = cartCookie.split(",").map(Number);

    try {
      const response = await fetch(`${apiHost}/api/products/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details.");
      }

      const products = await response.json();

      const productCounts = {};
      productIds.forEach((id) => {
        productCounts[id] = (productCounts[id] || 0) + 1;
      });

      const cartDetails = products
        .filter((product) => productCounts[product.product_id])
        .map((product) => ({
          ...product,
          quantity: productCounts[product.product_id],
        }));

      setCartItems(cartDetails);
      calculateSubtotal(cartDetails);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const calculateSubtotal = (items) => {
    const cost = items.reduce(
      (sum, item) => sum + Number(item.cost) * item.quantity,
      0
    );
    setSubtotal(cost);

    const tax = cost * TAX_RATE;
    setEstimatedTax(tax);

    const totalAmount = cost + tax;
    setTotal(totalAmount);
  };

  const handleProceedToCheckout = () => {
    if (user) {
      // Store the amounts in cookies
      Cookies.set("subtotal", subtotal.toFixed(2)); // Store subtotal
      Cookies.set("estimatedTax", estimatedTax.toFixed(2)); // Store tax
      Cookies.set("total", total.toFixed(2)); // Store total amount
  
      navigate("/checkout"); // Proceed to Checkout if user is logged in
    } else {
      const confirmLogin = window.confirm(
        "You need to log in to proceed to checkout. Do you want to log in now?"
      );
      if (confirmLogin) {
        navigate("/login?redirect=checkout"); // Redirect to login with a return URL
      }
    }
  };
  

  const handleContinueShopping = () => {
    navigate("/");
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    calculateSubtotal(updatedItems);

    const updatedCart = [];
    updatedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedCart.push(item.product_id);
      }
    });

    if (updatedCart.length > 0) {
      Cookies.set("cart", updatedCart.join(","));
    } else {
      Cookies.remove("cart");
      setCartItems([]);
      setSubtotal(0);
      setEstimatedTax(0);
      setTotal(0);
    }
  };

  const removeItemFromCart = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.product_id !== productId
    );
    setCartItems(updatedItems);

    calculateSubtotal(updatedItems);

    const updatedCart = [];
    updatedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedCart.push(item.product_id);
      }
    });

    if (updatedCart.length > 0) {
      Cookies.set("cart", updatedCart.join(","));
    } else {
      Cookies.remove("cart");
      setCartItems([]);
      setSubtotal(0);
      setEstimatedTax(0);
      setTotal(0);
    }
  };

  return (
    <div className="text-center mb-4">
      <h1>My Cart</h1>

      <div className="container mt-5">
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map((item) => (
              <div
                key={item.product_id}
                className="cart-item d-flex mb-4 p-3 border rounded shadow-sm"
              >
                <div className="item-image me-3">
                  <img
                    src={`${apiHost}/images/${item.filename}`}
                    className="img-fluid rounded"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="item-details flex-grow-1">
                  <h5>{item.name}</h5>
                  <div className="quantity-control d-flex align-items-center mt-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center mx-2"
                      value={item.quantity}
                      readOnly
                      style={{ width: "50px" }}
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="btn btn-link text-danger ms-3"
                      onClick={() => removeItemFromCart(item.product_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="item-price text-end" style={{ width: "120px" }}>
                  <p className="mb-0 fw-bold">
                    ${(item.cost * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="text-end mt-4">
              <h4>Sub-total: ${subtotal.toFixed(2)}</h4>
              <h5>Estimated Tax (15%): ${estimatedTax.toFixed(2)}</h5>
              <h4>Total: ${total.toFixed(2)}</h4>
            </div>
            <div className="text-end mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={handleProceedToCheckout}
              >
                Proceed to Check Out
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Your cart is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

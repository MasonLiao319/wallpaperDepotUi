import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  const apiHost = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetchCartFromCookies();
  }, []);

  // Fetch cart data from cookies
  const fetchCartFromCookies = async () => {
    const cartCookie = Cookies.get("cart"); // Retrieve the cart cookie
    if (!cartCookie) {
      setCartItems([]); // Clear cart items
      setSubtotal(0); // Reset subtotal
      return;
    }

    const productIds = cartCookie.split(",").map(Number);

    try {
      // Fetch product details based on product IDs
      const response = await fetch(`${apiHost}/api/products/all`); 
      if (!response.ok) {
        throw new Error("Failed to fetch product details.");
      }

      const products = await response.json();

      // Map products with their quantities
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

  // Calculate subtotal
  const calculateSubtotal = (items) => {
    const cost = items.reduce(
      (sum, item) => sum + Number(item.cost) * item.quantity,
      0
    );
    setSubtotal(cost);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1

    // Update cartItems state
    const updatedItems = cartItems.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Update subtotal
    calculateSubtotal(updatedItems);

    // Update cart cookie
    const updatedCart = [];
    updatedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedCart.push(item.product_id);
      }
    });

    if (updatedCart.length > 0) {
      Cookies.set("cart", updatedCart.join(",")); // Update the cookie
    } else {
      Cookies.remove("cart"); // Remove the cookie if cart is empty
      setCartItems([]); // Clear cart items
      setSubtotal(0); // Reset subtotal
    }
  };

  // Remove an item from the cart
  const removeItemFromCart = (productId) => {
    // Remove item from cartItems state
    const updatedItems = cartItems.filter(
      (item) => item.product_id !== productId
    );
    setCartItems(updatedItems);

    // Update subtotal
    calculateSubtotal(updatedItems);

    // Update cart cookie
    const updatedCart = [];
    updatedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedCart.push(item.product_id);
      }
    });

    if (updatedCart.length > 0) {
      Cookies.set("cart", updatedCart.join(",")); // Update the cookie
    } else {
      Cookies.remove("cart"); // Remove the cookie if cart is empty
      setCartItems([]); // Clear cart items
      setSubtotal(0); // Reset subtotal
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
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
                  $
                  {(item.cost * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className="text-end mt-4">
            <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
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

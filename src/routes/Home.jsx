import React, { useEffect, useState } from 'react';
import Card from '../ui/Card'; 

import '../index.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const apiHost = import.meta.env.VITE_API_HOST;

  // Fetch products when the component mounts
  useEffect(() => {
    fetch(`${apiHost}/api/products/all`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // Stop loading after fetching products
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false); // Stop loading even on error
      });
  }, [apiHost]);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show message if no products are available
  if (!products || products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <>
    

      <div className="container mt-4">
        <div className="row justify-content-center">
          {products.map((product) => (
            <div className="col-md-4 mb-4 d-flex justify-content-center" key={product.id}>
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

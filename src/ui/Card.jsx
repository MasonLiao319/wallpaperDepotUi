import { Link } from 'react-router-dom';

export default function Card({ product }) {
  const apiHost = import.meta.env.VITE_API_HOST;

  return (
    <div className="card h-100">
      <img
        src={`${apiHost}/images/${product.filename}`}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: 'cover', height: '150px', width: '100%' }} // Thumbnail style
      />
      <div className="card-body">
        <h5 className="card-title">{product.name} - ${product.cost}</h5>
        <p className="card-text">{product.description}</p>
        
        {/* Navigate to product details */}
        <Link to={`/products/${product.product_id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

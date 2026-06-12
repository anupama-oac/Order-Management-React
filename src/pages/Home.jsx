import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ബാക്കെൻഡിൽ നിന്ന് പ്രോഡക്റ്റുകൾ എടുക്കുന്നു
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products Store</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.length === 0 ? <p>No products available. Add some in DB!</p> : 
          products.map(product => (
            <div key={product._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', width: '200px' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <h4>₹ {product.price}</h4>
              <button onClick={() => window.location.href = '/cart'}>Buy Now</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Home;
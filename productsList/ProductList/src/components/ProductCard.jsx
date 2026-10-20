import React from 'react'
import "../components/productCard.css"
import products from "../components/ProductLists"
import {useNavigate} from 'react-router-dom'
import Laptop from "../components/Laptop"
function ProductCard() {
    const navigate = useNavigate();
    
  return (
    <div className = "productCards">
        {
            products.map((product,index)=>(
                
                    <div className="productCard" key={index}>
                    <h3>
                        {product.productName}
                    </h3>
                    <button onClick={()=> navigate(`/${product.productName}`)}>
                        
                        Show Items
                    </button>
                </div>
                
  ))}
  
    </div>
  )
}

export default ProductCard
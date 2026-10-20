import { useNavigate } from "react-router-dom";

const smartphones = [
  {
    id: 1,
    brand: "Apple",
    model: "iPhone 15 Pro",
    processor: "A17 Pro",
    ram: "8GB",
    storage: "256GB",
    price: 999,
    rating: 4.8,
  },
  {
    id: 2,
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "512GB",
    price: 1199,
    rating: 4.7,
  },
  {
    id: 3,
    brand: "Google",
    model: "Pixel 8 Pro",
    processor: "Tensor G3",
    ram: "12GB",
    storage: "256GB",
    price: 999,
    rating: 4.6,
  },
  {
    id: 4,
    brand: "OnePlus",
    model: "OnePlus 11",
    processor: "Snapdragon 8 Gen 2",
    ram: "16GB",
    storage: "512GB",
    price: 799,
    rating: 4.5,
  },
  {
    id: 5,
    brand: "Xiaomi",
    model: "Mi 13 Pro",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "512GB",
    price: 899,
    rating: 4.6,
  },
  {
    id: 6,
    brand: "Sony",
    model: "Xperia 1 V",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "256GB",
    price: 1299,
    rating: 4.4,
  },
  {
    id: 7,
    brand: "Asus",
    model: "ROG Phone 7",
    processor: "Snapdragon 8 Gen 2",
    ram: "16GB",
    storage: "512GB",
    price: 1099,
    rating: 4.7,
  },
  {
    id: 8,
    brand: "Realme",
    model: "GT Neo 5",
    processor: "Snapdragon 8+ Gen 1",
    ram: "16GB",
    storage: "512GB",
    price: 649,
    rating: 4.3,
  },
  {
    id: 9,
    brand: "Oppo",
    model: "Find X6 Pro",
    processor: "Snapdragon 8 Gen 2",
    ram: "16GB",
    storage: "512GB",
    price: 999,
    rating: 4.5,
  },
  {
    id: 10,
    brand: "Vivo",
    model: "X90 Pro",
    processor: "Dimensity 9200",
    ram: "12GB",
    storage: "256GB",
    price: 899,
    rating: 4.6,
  },
];


function Smartphone() {
  const navigate = useNavigate();
  return (
    <>
      <div className="productCards">
        {
          smartphones.map((product, index) => (

            <div className="productCard" key={index}>
              <h3>
                {product.brand}
              </h3>
              <button onClick={() => navigate(`/SmartPhone/${product.brand}`, { state: { phone : product } })}>

                view  Details
              </button>
            </div>

          ))}

      </div>
    </>
  )
}

export default Smartphone;
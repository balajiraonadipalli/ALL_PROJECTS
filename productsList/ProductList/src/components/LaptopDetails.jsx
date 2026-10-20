import { useLocation } from "react-router-dom";
import "../components/ProductCard.css"

function LaptopDetails() {
    const location = useLocation();
    const {laptopName} = location.state || {}
    return (
        <>
            <div className="productCards">

                <div className="productCard">
                    <h2>{laptopName?.brand}</h2>
                    <img src={laptopName?.url} alt={laptopName?.model} className="img" />
                    <p>Model: {laptopName?.model}</p>
                    <p>Price: {laptopName?.price}</p>
                </div>

            </div>
        </>
    )
}

export default LaptopDetails;
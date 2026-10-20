import { useLocation } from "react-router-dom"

function SmartPhoneDetails() {
    const location = useLocation();
    const { phone } = location.state || {};
    console.log("Location State:", location.state);
    return (
        <>
            <div className="productCards">

                <div className="productCard">

                    <h2>{phone?.brand}</h2>
                    <p>Model: {phone?.model}</p>
                    <p>Price: {phone?.price}</p>


                </div>

            </div>
        </>
    )
}

export default SmartPhoneDetails;
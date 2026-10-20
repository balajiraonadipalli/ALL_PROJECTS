import { Link } from "react-router-dom";
import "./Menubar.css"
function Menubar(){
  
    return(
        <>
        <nav>
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Pack & Go</a>
          </div>
          <ul className="nav navbar-nav">
            <li className="active"><a href="#">Home</a></li>
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#">Top Destinations<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/TopDestinations">TopDestinations</Link></li>
                <li><Link to="/Categories">Categories</Link></li>
                <li><a href="#">profile</a></li>
              </ul>
            </li>


            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#">Categories<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/HillStations">Hill Stations</Link></li>
                <li><Link to="/SpiritualDestinations">Spiritual Destinations</Link></li>
                <li><Link to="/Deserts">Desert and Landscapes</Link></li>
                <li><Link to="/Beaches">Beach</Link></li>

              </ul>
            </li>

            <li><Link to="/SignUpPage">SignUp</Link></li>
          </ul>
        </div>
      </nav>
        </>
    )
}

export default Menubar;
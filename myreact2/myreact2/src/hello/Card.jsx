import profilePic from './assets/profile.jpg' 

function Card()
{
    return(
<>
<div className="card">
    <img className="imgCard" src={profilePic} alt="balu">

    </img>
    <h2 className="Card-title">
        Balaji
    </h2>
    <p className='card-des'>
        I am learning react from bro code
    </p>
</div>

</>
);
}
export default Card
import React,{useState} from 'react';

function UpdateList()
{
    const [cars,setCars] = useState([]);
    const [carYear,setYear]=useState(new Date().getFullYear());
    const [carMake,setMake]=useState("");
    const [carModel,setModel]=useState("");
    function HandleCars()
    {
        const newCar={
            year:carYear,
            Make:carMake,
            Model:carModel
        }
        setCars(c => [...c,newCar]);
        setYear(new Date().getFullYear());
        setModel("");
        setMake("");
        
    }
    function UpdateYear(e)
    {
        setYear(e.target.value);
    }
    function UpdateMake(e)
    {
        setMake(e.target.value);
    }
    function UpdateModel(e)
    {
        setModel(e.target.value)
    }
    function removeCar(index)
    {
        setCars(C=>C.filter((_,i) => i!==index));
    }


    return(
        <>
        <div>
        <h1>
            List of car Objects
        </h1>
    <ul>
        {cars.map((car,index)=> (
        <li key={index} onClick={(()=>removeCar(index))}>
            {car.year} {car.Make} {car.Model}
        </li>))}

    </ul>

        <input type= 'number' value={carYear} onChange={UpdateYear}/>
        <br></br>
        <br></br>
        <input type='text' placeholder='carMake' onChange={UpdateMake}/>
        <br></br>
        <br></br>
        <input type='text' placeholder='carMake' onChange={UpdateModel}/>
        <br></br>
        <br></br>
        <button onClick={HandleCars}>
        Add cars
        </button>
        </div>
        </>
    );
}
export default UpdateList;
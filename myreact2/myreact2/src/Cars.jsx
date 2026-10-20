import React,{useState} from 'react';

function Cars(){

    const [cars,setCar] = useState([]);
    const [caryear,setYear] = useState("");
    const [carModel,setModel] = useState("");
    const [carcolor,setColor] = useState("");
    function handleCar(){
        const newCar = {
            year:caryear,
            model:carModel,
            color:carcolor
        }
        setCar(c => [...cars, newCar]);
        setYear('');
        setModel('');
        setColor('');
    }
    function removeCar(index){
        setCar((c)=>c.filter((_,i)=>{i!==index}));
    }
    function handleYear(e){
        setYear(e.target.value);
    }
    function handleModel(e){
        setModel(e.target.value);
    }
    function handleColor(e){
        setColor(e.target.value);
    }
    return(
        <>
        <div className="body">
        <div>
            <h2>Cars Manufacture</h2>
            <ul>
                {cars.map((car,index)=>(
                <li key={index} onClick={()=>removeCar(index)}>Year: {car.year}, Model: {car.model}, Color: {car.color}</li>

                ))}
            </ul>
                <input type="date" placeholder='Enter the Year ' value={caryear} onChange={handleYear}/>
                <br></br>
                <input type="text" placeholder='Enter the Model ' value={carModel} onChange={handleModel}/>
                <br></br>
                <input type="text" placeholder='Enter the Color ' value={carcolor} onChange={handleColor}/>
                <br></br>
                <button onClick={handleCar}>Add Car</button>
        </div>
        </div>
        </>
    );


}

export default Cars;
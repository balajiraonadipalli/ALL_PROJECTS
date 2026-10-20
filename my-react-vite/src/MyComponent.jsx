import React,{useState} from 'react';

function MyComponent()
{
    const [name,setName]=useState("");
    const [payment,setp]=useState("");
    const [Stype,setShipping]=useState("");
    const [para,setpara]=useState("");
    const [color,setcolor]=useState("#ffffff");
    const [count,setcount]=useState(0);
    const [car,setcar] = useState({year: 2024,
                                   make: "tata",
                                   model: "curve"
    })
    function update(e)
    {
        setName(e.target.value);
    }
    function paymentMethod(e)
    {
        setp(e.target.value)
    }
    function ShippingMethod(e)
    {
        setShipping(e.target.value);
    }
    function updatePara(e)
    {
        setpara(e.target.value);
    } 
    function updateColor(e)
    {
        setcolor(e.target.value);
    }
    function increaseCount()
    {
        setcount(c=>c+1);
        setcount(c=>c+1);
    }
    function decreasecount()
    {
        setcount(count-1);
    }
    function setC()
    {
        setcount("0");
    }
    function updateYear(e)
    {
        setcar(car=>({...car,year:e.target.value}));
    }
    function updatemake(e)
    {
        setcar(car=>({...car,make:e.target.value}));
    }
    function updatemodel(e)
    {
        setcar(car=>({...car,model:e.target.value}));
    }
    return(
        <>
        {/* <div>
        <input onChange={update} value={name} placeholder='type something'></input>
        <p> name:{name}</p>
        </div>
        <select value={payment} onChange={paymentMethod}>
            <option value="">Select an option</option>
            <option value='visa'>visa</option>
            <option value='Cash on delivery'>cash on delivery</option>
            <option value='Card'>card</option>
        </select>
        <p>
            paymentMethod:{payment}
        </p>
        <label>
            <input type='radio' value='pick up'
            checked={Stype=='pick up'}
            onChange={ShippingMethod}
            />
            pick up
        </label>
        <br></br>
        <label>
            <input type='radio' value={'delivery'}
            checked={Stype=='Delivery'}
            onChange={ShippingMethod}
            />
            Delivery
        </label>
        <p>
            shipping:{Stype}
        </p>

        <p>
        use paragraph here: {para}

        </p>
       
        <p contentEditable="true" onChange={updatePara} value={para}>
            
        </p> */}
        
            {/* <div className="colorPicker">
            <h1>
                color picker
            </h1>
            <div className="displayColor" style={{backgroundColor:color}}>
            <p>
                {color}
            </p>
            </div>
            <label>
                select a color:<input  value="color" type="color" onChange={updateColor}/>
            </label>
            </div> */}
            {/* <p>
                Count:{count}
            </p>
                <button onClick={(increaseCount)}>
                    increment
                </button>
                <button onClick={(decreasecount)}>
                    decreament
                </button>
                <button onClick={(setC)}>
                    set count
                </button> */}

                <p>
                    your favorite car is :{car.year} {car.make} {car.model}
                </p>
                <input type='number' onChange={updateYear}/>
                <br></br>
                <input type='text' onChange={updatemake}/>
                <br></br>
                <input type='text' onChange={updatemodel}/>


        </>
    );


}
export default MyComponent
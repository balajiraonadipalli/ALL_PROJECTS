import React,{useState} from "react";


const InitialData = {
    name:"",
    password:"",
}

function Form(){

    const [formData,setFormData] = useState(InitialData);
    const handleChange = (event) => {
        var FieldValue;
        const { name,value } = event.target;
        setFormData(
            (prevData)=>({
                ...prevData,[name]:value
            }));
        

    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        const dataString = Object.keys(formData).map((fieldName)=> `${fieldName}:${formData[fieldName]}`).join("\n");
        alert(`Form data:\n${dataString}`);
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                    Name:
                </label>
                <input type="text" placeholder="Name" name="name" id="name" onChange={handleChange} value={formData.value}/>
                <br/>
                <br/>
                <label htmlFor="password">
                    PassWord:
                </label>
                <input type="password" placeholder="Password" name="password" id="password" onChange={handleChange} value={formData.value}/>
                <br/>
                <br/>
                <button type="submit">Submit</button>
                
            </form>
        </>
    )
}

export default Form;
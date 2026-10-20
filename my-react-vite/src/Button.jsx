function Button(props)
{
    let count=0;
    const handleclick=(e)=> 
    {
        // if(count<3)
        // {
        //     count++;
        //     console.log(`${name} you are clicking more times`);
        // }

        // else{
        //     console.log(`${name} stop clicking me`);
        // }
        e.target.textContent="stop clicking";

    }

   
    return(
        <>
        <button onClick={(e)=>handleclick(e)}>
            click here
        </button>
        </>
    );
}

export default Button
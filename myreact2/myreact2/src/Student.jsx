

function Student(props){
    return(
        <>
    <p> Name: {props.name}</p>
    <p> Age: {props.age}</p>
    <p> isStudent: {props.isStudent ? "Yes" : "NO"}</p>
    </>
    );
}

export default Student;
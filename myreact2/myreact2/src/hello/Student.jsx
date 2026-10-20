
function Student(prop)
{
    return(
        <>
        <div className="Student">
            <p>Name:{prop.name}</p>
            <p>Age:{prop.age}</p>
            <p>Student:{prop.isStudent ? " yes":"No"}</p>
        </div>
        </>
    );
}
export default Student
import PropTypes from 'prop-types'

function Student(props)
{
    return(
        <>
        <div>
            <p>
                name:{props.name}
            </p>
            <p>
                age:{props.age}
            </p>
            <p>
                IsStudent:{props.IsStudent ? "True":"false"}
            </p>
        </div>


        </>
    );
}
Student.propTypes={
    name:PropTypes.string,
    age:PropTypes.number,
    IsStudent:PropTypes.bool
}
Student.defaultProps={
    name:"Guest",
    age:30,
    IsStudent:"True"
}
export default Student
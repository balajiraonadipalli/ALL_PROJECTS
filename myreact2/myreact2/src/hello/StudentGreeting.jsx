

import proptypes from 'prop-types'

function StudentGreeting(prop)
{
    // if(prop.isLogged)
    // {
    //     return <h2>welcome {prop.username}</h2>
    // }
    // else{
    //     return <h2>Please log in to continue</h2>
    // }
    return(
        
        prop.isLogged ? <h2 className="login-message">welcome {prop.username}</h2>
                        :<h2 className="no-log-in-message">please log in </h2>
       
    );

}
StudentGreeting.proptypes={
    isLogged : proptypes.bool,
    username : proptypes.string,
}
StudentGreeting.defaultProps=
{
    isLogged:false,
    username:"guest",
}

export default StudentGreeting
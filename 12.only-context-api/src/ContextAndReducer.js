import React,{ createContext,useContext,useReducer } from "react"

const reducer = (state,action)=>{
    switch(action.type){
        case "Increment":
            return {count:state.count+1};
        case "Decrement":
            return {count:state.count-1};
        default:
            return state;
    }
}

const counterContext = createContext();

const Counterprovider=({children})=>{
    const [state,dispatch] = useReducer(reducer,{count:0});
    return(
        <>
        <counterContext.Provider value={{state,dispatch}}>
        {children}
        </counterContext.Provider>
        
        </>
    )
}

const useCount=()=> useContext(counterContext);


function Context(){
    const {state,dispatch} = useCount();
        return(
        <>
        <h3>
            count: {state.count}
        </h3>
        <button onClick={()=>{dispatch({type:"Increment"})}}>+</button>
        <button onClick={()=>{dispatch({type:"Decrement"})}}>-</button>
        </>
    )
}

function ContextAndReducer(){
    return(
        <>
        <Counterprovider>
        <Context/>
        </Counterprovider>
        </>
    )

}

export default ContextAndReducer;
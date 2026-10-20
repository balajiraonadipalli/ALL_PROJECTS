import React,{useContext,createContext,useState} from 'react'
import "./App.css"
const countContext = createContext();

function CountProvider({children}){
    const [count,setCount] = useState(0);
    const increment = () => setCount(count+1);
    const decrement = () => setCount(count-1);

    return(
    <>
    <countContext.Provider value={{increment,decrement,count}}>
        {children}
    </countContext.Provider>
    
    </>
)

}

function useCount(){
    const context = useContext(countContext);
    return context;
}

function CounterApp() {
    const {count,increment,decrement} = useCount();
  return (
    <>
    <div className="counter-container">
      <h1> {count}</h1>
      <button className="button" onClick={increment}>
        +
      </button>
      <button className="button" onClick={decrement}>
        -
      </button>
    </div>
    </>
  )
}


function Counter(){
    return(
        <>
        <div className="app-container">
      <h1 className="title">React Counter</h1>
      <p className="sub-description">
        A simple counter application using Context API
      </p>
      
      <CountProvider>
      <CounterApp />
      </CountProvider>
        
     
    </div>
        </>
    )
}

export default Counter;
import React from 'react'
import {useSelector,useDispatch} from 'react-redux';
import Card from "./Card"
import {increment,decrement} from "./counterSlice";





function App() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    // <div>
    //   <h1>
    //     Counter App
    //   </h1>
    //   <h2>{count}</h2>
    //   <button onClick={()=>dispatch(increment())}>Increment ++</button>
    //   <button onClick={()=>dispatch(decrement())}>Decrement --</button>
    // </div>
    <>
    <Card />
    </>
  )
}

export default App
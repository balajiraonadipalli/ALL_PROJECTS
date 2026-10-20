 import Header from './Header.jsx'
 import Footer from './Footer.jsx'
 import Food from './Food.jsx'
 import Student from './Student.jsx'
 import Button from './Button.jsx'
 import MyComponent from './MyComponent.jsx'
import UpdateList from './UpdateList.jsx'
import TodoList from './To-do-List.jsx'
import React,{Component} from 'react';

// class APP extends React.Component{
//   constructor()
//   {
//     super();
//     this.state={displayBio:false};
//     this.toggleDisplayBio=this.toggleDisplayBio.bind(this);
//   }
//   toggleDisplayBio()
//   {
//     this.setState({displayBio: !this.state.displayBio});
//   }

// render(){
//   return(

//   <div>
// <h1>
//   Welcome to hello
// </h1>
// {this.state.displayBio?(
//     <div>
//       <p><h4>Javatpoint is one of the best Java training institute in Noida, Delhi, Gurugram, Ghaziabad and Faridabad. We have a team of experienced Java developers and trainers from multinational companies to teach our campus students.</h4></p> 
      
//       <button onClick={this.toggleDisplayBio}>
//     showLess
//       </button>
//       </div>
//   ):(
//   <div>
//     <button onClick={this.toggleDisplayBio}>
//       read More
//     </button>
//   </div>
// )}
//   </div>

// );

// }}

// 


class APP extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state={
      favoriteColor:'red'
    };

  }
  componentDidMount()
  {
  setTimeout(() => {
    this.setState({favoriteColor:'Blue'})
  },1000)
}
render()
{
  return(
   <h1>
    my fourite color is {this.state.favoriteColor}
   </h1>
  );
}
}
export default APP;


// return (
  //   <>
  //   {/* <Header/>
  //   <Food/>
  //   <Footer/> */}
  //   {/* <Student name="balaji" age='20' IsStudent="False"/>
  //   <Student  age='20' IsStudent="False"/>
  //   <Student name="balaji"  IsStudent="False"/> */}

  //     {/* <Button/> */}
  //     {/* <MyComponent/> */}
  //     {/* <UpdateList/> */}
  //     {/* <TodoList/> */}



  //   </>
  // )
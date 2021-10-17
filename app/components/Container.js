import React, { useContext } from "react"
// import StateContext from "../StateContext"
// import DispatchContext from "../DispatchContext"

function Container(props) {
  // const globalState = useContext(StateContext)
  // const globalDispatch = useContext(DispatchContext)

  // const closePopup = () => {
  //   if(globalState.popup) {
    
  //     globalDispatch({type: "closePopup"})
    
  // }
  // }

  return (
    <>
        <div className="theme-dark">
          {props.children}
        </div>
    </>
  )
}

export default Container
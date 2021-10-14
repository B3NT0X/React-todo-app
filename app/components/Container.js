import React, { useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Container(props) {
  const globalState = useContext(StateContext)
  const globalDispatch = useContext(DispatchContext)

  const closePopup = () => {
    if(globalState.popup) {
    
      globalDispatch({type: "closePopup"})
    
  }
  }

  return (
    <>
        <div onClick={closePopup} className={globalState.darkMode ? "theme-dark" : null}>
          {props.children}
        </div>
    </>
  )
}

export default Container
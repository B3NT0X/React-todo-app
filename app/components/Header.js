import React, { useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Header(props) {
  const globalState = useContext(StateContext)
  const globalDispatch = useContext(DispatchContext)
  const headerContent = globalState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />

 const handleSidebar = (e) => {
  e.preventDefault()
  globalDispatch({type: "openSidebar"})
 }

 

  return (
    <>
    <header className="header-bar bg-primary mb-3">
      {globalState.loggedIn ? <span onClick={handleSidebar} style={globalState.sidebar ? {display: "none"} : {display:"inline-block"}} className="btn btn-sm position"><i className="fas fa-bars size"></i></span> : null}
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to={"/"} className="text-white">
            Brain Notes
          </Link>
        </h4>
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
    </>
  )
}

export default Header
import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Sidebar(props) {
    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

    const handleLogout = () => {
        globalDispatch({type: "logout"})
        props.history.push("/")
        globalDispatch({type: "flashMessages", value: "Du hast dich ausgeloggt.", color: "info"})
      }

  return (
      <>
      {globalState.loggedIn ? 
        <div className="sidenav">
            <span className="close-position" onClick={() => globalDispatch({type: "closeSidebar"})}><i className="far fa-times-circle size"></i></span>
            <div className="sidebarContent">
                <h2>Menu</h2>
                <Link className="btn btn-sm btn-success mx-auto" to="/create-post">
                    Erstelle Beitrag
                </Link>
                <Link to={""} onClick={handleLogout} className="btn btn-sm btn-secondary mx-auto mt-1">
                    Abmelden
                </Link>
            </div>
        </div>
    : null}
  </>
  )
}

export default withRouter(Sidebar)
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

      const capitalize = str => {
        return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase()
      }

  return (
      <>
      {globalState.loggedIn ? 
        <div className="sidenav">
            <span className="close-position" onClick={() => globalDispatch({type: "closeSidebar"})}><i className="far fa-times-circle size"></i></span>
            <div style={{marginTop:"30px"}} className="sidebarContent">
            <Link className="mx-auto pl-2 text-center" to={`/profile/${globalState.user.username}`}>
              <img style={{width: "62px", height:"62px", borderRadius: "32px"}} className="small-header-avatar" src={globalState.user.avatar} />
            </Link>
            <strong><p style={{color:"#fff"}} className="text-center">{capitalize(globalState.user.username)}</p></strong>
                <Link className="btn btn-sm btn-success mx-auto w-100" to="/create-post">
                    Erstelle Beitrag
                </Link>
                <Link to={""} onClick={handleLogout} className="btn btn-sm btn-secondary mx-auto mt-1 w-100">
                    Abmelden
                </Link>
            </div>
        </div>
    : null}
  </>
  )
}

export default withRouter(Sidebar)
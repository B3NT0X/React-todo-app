import React, {useContext} from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function HeaderLoggedIn() {
  const globalState = useContext(StateContext)
  const globalDispatch = useContext(DispatchContext)

  const handlePopup = () => {
    globalDispatch({type: "popup"})
  }

  const handleSearch = (e) => {
    e.preventDefault()
    globalDispatch({type: "openSearch"})
  }

  return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={handleSearch} href="" className="text-white mr-3 header-search-icon">
              <i className="fas fa-search"></i>
            </a>
            <Link to={`/profile/${globalState.user.username}`}>
              <img className="small-header-avatar" src={globalState.user.avatar} />
            </Link>
         <strong>
          <a style={{cursor: "pointer", color: "var(--text-color)"}} onClick={handlePopup} className="mr-2">
            {globalState.user.username}
            <i className="fas fa-angle-down ml-1 ml-3"></i>
          </a>
          </strong> 
          <div className="card position-absolute w-18 mt-2" style={globalState.popup ? {opacity: 1, visibility: "visible", width: "18rem"} : {opacity: 0, visibility: "hidden"}}>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <label className="switch">
                  <input type="checkbox" onChange={() => globalDispatch({type: "darkMode"})} checked={globalState.darkMode} />
                  <span className="slider round"></span>
                </label>
              </li>
              <li className="list-group-item">Einstellungen</li>
              <li className="list-group-item">Datenschutz</li>
            </ul>
          </div>
        </div>
  )
}

export default HeaderLoggedIn
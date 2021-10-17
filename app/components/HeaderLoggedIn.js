import React, {useContext, useState, useEffect} from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function HeaderLoggedIn() {
  const globalState = useContext(StateContext)
  const globalDispatch = useContext(DispatchContext)
  const [theme, setTheme] = useState(localStorage.getItem("theme"))

  const handleSearch = (e) => {
    e.preventDefault();
    globalDispatch({type: "openSearch"})
  }

  const themeToggle = (e) => {
    e.preventDefault();
    theme === "dark" ? setTheme("light") : setTheme("dark")

  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme])


  return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={themeToggle} href="" className="text-white mr-4 header-search-icon">
              <i className="fas fa-adjust"></i>
            </a>
            <a onClick={handleSearch} href="" className="text-white mr-3 header-search-icon">
              <i className="fas fa-search"></i>
            </a>
            <Link to={`/profile/${globalState.user.username}`}>
              <img className="small-header-avatar" src={globalState.user.avatar} />
            </Link>
        </div>
  )
}

export default HeaderLoggedIn
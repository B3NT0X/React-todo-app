import React, { useState, useContext, useEffect } from "react"
import axios from "axios"
import {useImmer} from "use-immer"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut() {
    const globalDispatch = useContext(DispatchContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [state, setState] = useImmer({
      count: 0
    })
    
    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        try {
          const response = await axios.post("http://localhost:8080/login", {username, password})
          if(response.data) {
                globalDispatch({type: "login", data: response.data})
                globalDispatch({type: "flashMessages", value: "Du hast dich erfolgreich eingeloggt!", color: "success"})
          } else {
            console.log("falscher/s Name/Passwort")
            setState(draft => {
              draft.count++
            })
          } 
        } catch(e) {
            console.log("error")
        }
    }


  return (
    <>
     <form onSubmit={handleSubmitLogin} className="mb-0 pt-2 pt-md-0">
          <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input value={username} onChange={e => setUsername(e.target.value)} name="username" className={"form-control form-control-sm input-dark " + (state.count && !username ? "is-invalid" : null)} type="text" placeholder="Name" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input value={password} onChange={e => setPassword(e.target.value)} name="password" className={"form-control form-control-sm input-dark " + (state.count && !password ? "is-invalid" : null)} type="password" placeholder="Passwort" />
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn btn-success btn-sm">Einloggen</button>
            </div>
          </div>
        </form>   
   </>
  )
}

export default HeaderLoggedOut
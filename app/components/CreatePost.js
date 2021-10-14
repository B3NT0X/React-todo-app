import React, { useState, useContext } from "react"
import axios from "axios"
import { withRouter } from "react-router"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreatePost(props) {
    const [title, setTitle] =  useState("")
    const [message, setMessage] = useState("")
    const globalDispatch = useContext(DispatchContext)
    const globalState = useContext(StateContext)

    
      
      const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post("/create-post", {
                //objekt wird von Backend geprüft. "value" ist aus dem State (message)
                title, body: message, token: globalState.user.token
            })
            globalDispatch({type: "flashMessages", value: "Du hast einen neuen Post erstellt.", color: "success"})
            props.history.push(`/post/${response.data}`)

        } catch(e) {
            console.error(e)
        }
    }
    
   

  return (
    <div className="container container--narrow py-md-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Titel</small>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Nachricht</small>
          </label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Beitrag speichern</button>
      </form>
    </div>
  )
}

export default withRouter(CreatePost)
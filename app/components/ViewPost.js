import React, { useState, useEffect, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import axios from "axios"
import Loading from "./Loading"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewPost(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState([])
  const {id} = useParams()

  const globalState = useContext(StateContext)
  const globalDispatch = useContext(DispatchContext)

  useEffect(() => {
      const cancelRequest = axios.CancelToken.source()

      const fetchPostsData = async () => {
      try {
          const response = await axios.get(`/post/${id}`, {cancelToken: cancelRequest.token})
          setPost(response.data)
          setIsLoading(false)
      }
       catch(e) {
          console.error(e)
      } 
  }
  fetchPostsData()
  return(() => {
    cancelRequest.cancel()
  })
  },[id])

 
  if(!isLoading && !post) {
    return <NotFound />
  }

  if(isLoading) return <Loading />

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const isOwner = () => {
    if(globalState.loggedIn) {
      return globalState.user.username == post.author.username
    }
    return false
  }

  const deleteHandler = async() => {
    const areUSure = window.confirm("Möchtest du den Beitrag wirklick löschen?")
    if(areUSure) {
      try {
       const response = await axios.delete(`/post/${id}`, {data:{token: globalState.user.token}})
       if(response.data == "Success") {
        globalDispatch({type: "flashMessages", value: "Post wurde erfolgreich gelöscht.", color: "success"})
        props.history.push(`/profile/${globalState.user.username}`)
      }
        
      } catch(e) {
        console.error(e)
      }
    }
  }

  return (
        <div className="container container--narrow py-md-5">
        <div className="d-flex justify-content-between">
          <h2>{post.title}</h2>
          {isOwner() && (
            <span className="pt-2">
              <Link to={`/post/${post._id}/edit`} className="text-primary mr-2" title="Bearbeiten"><i className="fas fa-edit"></i></Link>
              <a onClick={deleteHandler} className="delete-post-button text-danger" title="Löschen"><i className="fas fa-trash"></i></a>
            </span>
          )}
          
        </div>
  
        <p style={{color: "var(--text-color)"}} className="small mb-4">
          <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar} />
          </Link>
            erstellt von <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> am {formattedDate}
        </p>
  
        <div className="body-content">
          <p style={{color: "var(--text-color)"}}>{post.body}</p>
        </div>
      </div>
  )
}

export default withRouter(ViewPost)
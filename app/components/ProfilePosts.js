import React, { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import Loading from "./Loading"
import StateContext from "../StateContext"

function ProfilePosts() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const {username} = useParams()
    const globalState = useContext(StateContext)

    useEffect(() => {
        const cancelRequest = axios.CancelToken.source()

        const fetchPostData = async () => {
        try {
            const response = await axios.get(`/profile/${username}/posts`,{cancelToken: cancelRequest.token})
            setIsLoading(false)
            setPosts(response.data)
        }
         catch(e) {
            console.error(e)
        } 
    }
    fetchPostData()
    return(() => {
        cancelRequest.cancel()
    })
    },[username])


    if(isLoading) return <Loading />

  return (
    <div className="list-group">
        {posts.map(post => {
            const date = new Date(post.createdDate)
            const formattedDate = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`

            return(
            <Link to={`/post/${post._id}`} key={post._id} className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src={globalState.user.avatar} /> <strong>{post.title}</strong>
                <span className="text-muted small">{" "} {formattedDate} </span>
            </Link>
            )
        })}
      </div>
      
  )
}

export default ProfilePosts
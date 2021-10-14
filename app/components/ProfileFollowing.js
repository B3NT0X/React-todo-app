import React, { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import Loading from "./Loading"
import StateContext from "../StateContext"

function ProfileFollowing() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const {username} = useParams()
    const globalState = useContext(StateContext)

    useEffect(() => {
        const cancelRequest = axios.CancelToken.source()

        const fetchPostData = async () => {
        try {
            const response = await axios.get(`/profile/${username}/following`,{cancelToken: cancelRequest.token})
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
        {posts.map((follower, index) => {
            return(
            <Link to={`/profile/${follower.username}`} key={index} className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
            </Link>
            )
        })}
      </div>
      
  )
}

export default ProfileFollowing
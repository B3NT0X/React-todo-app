import React, { useEffect, useContext } from "react"
import {useParams, NavLink, Switch, Route} from "react-router-dom"
import axios from "axios"
import StateContext from "../StateContext"
import ProfilePosts from "./ProfilePosts"
import ProfileFollowers from "./ProfileFollowers"
import ProfileFollowing from "./ProfileFollowing"
import {useImmer} from "use-immer"

function Profile() {
  const {username} = useParams()
  const globalState = useContext(StateContext)
  const [state, setState] = useImmer({
   followActionLoading: false,
   startFollowingRequestCount: 0,
   stopFollowingRequestCount: 0,
   profileData: {
    profileUsername: "leer",
    profileAvatar: "...",
    isFollowing: false,
    counts: {
      followerCount: "",
      followingCount: "",
      postCount: ""
    }
   }
  })

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source()

    const fetchData = async () => {
      try{
        const response = await axios.post(`/profile/${username}`, {token: globalState.user.token}, {cancelToken: cancelRequest.token})
          setState(draft => {
            draft.profileData = response.data
          })
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
    return () => cancelRequest.cancel()
  }, [username])

  useEffect(() => {
    if(state.startFollowingRequestCount) {

    setState(draft => {
      draft.followActionLoading = true
    })

    const cancelRequest = axios.CancelToken.source()

    const fetchData = async () => {
      try{
        const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, {token: globalState.user.token}, {cancelToken: cancelRequest.token})
          setState(draft => {
           draft.profileData.isFollowing = true
           draft.profileData.counts.followerCount++
           draft.followActionLoading = false
          })
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
    return () => cancelRequest.cancel()
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if(state.stopFollowingRequestCount) {

    setState(draft => {
      draft.followActionLoading = true
    })

    const cancelRequest = axios.CancelToken.source()

    const fetchData = async () => {
      try{
        const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, {token: globalState.user.token}, {cancelToken: cancelRequest.token})
          setState(draft => {
           draft.profileData.isFollowing = false
           draft.profileData.counts.followerCount--
           draft.followActionLoading = false
          })
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
    return () => cancelRequest.cancel()
    }
  }, [state.stopFollowingRequestCount])

  const startFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }
  const stopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }


  return (
    <div className="container container--narrow py-md-5">
      <h2>
        <img className="avatar-small" src={globalState.user.avatar} /> {state.profileData.profileUsername}
        {globalState.loggedIn && !state.profileData.isFollowing && globalState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
            <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Folgen <i className="fas fa-user-plus"></i></button>
        )}
        {globalState.loggedIn && state.profileData.isFollowing && globalState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
            <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Entfolgen <i className="fas fa-user-times"></i></button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Beiträge: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Abonnenten: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Abonniert: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </div>
  )
}

export default Profile
import React, { useEffect, useContext } from "react"
import axios from "axios";
import {useImmerReducer} from "use-immer"
import {CSSTransition} from "react-transition-group"
import DispatchContext from "../DispatchContext";

function Content() {
const globalDispatch = useContext(DispatchContext)

const initialState = {
  username: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0
  },
  email: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0
  },
  password: {
    value: "",
    hasErrors: false,
    message: ""
  },
  submitCount: 0
}

const validationReducer = (draft, action) => {
switch(action.type) {
  case "usernameImmediately":
    draft.username.hasErrors = false
    draft.username.value = action.value
    if(draft.username.value.length > 30) {
      draft.username.hasErrors = true
      draft.username.message = "Bitte nicht länger als 30 Charackter überschreiten."
    }
    if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
      draft.username.hasErrors = true
      draft.username.message = "Bitte Sonderzeichen beachten."
    }
    return
  case "usernameAfterDelay":
    if(draft.username.value < 3) {
      draft.username.hasErrors = true
      draft.username.message = "Username muss länger als 3 Charackter lang sein."
    }
    if(!draft.username.hasErrors && !action.noRequest) {
      draft.username.checkCount++
    }
    return
  case "usernameUniqueResults":
    if(action.value) {
      draft.username.hasErrors = true
      draft.username.isUnique = false
      draft.username.message = "username ist vergeben"
    }
    else {
      draft.username.isUnique = true
    }
    return
  case "emailImmediately":
    draft.email.hasErrors = false
    draft.email.value = action.value
    return
  case "emailAfterDelay":
    if(!/^\S+@\S+$/.test(draft.email.value)) {
      draft.email.hasErrors = true
      draft.email.message = "Du musst eine gültige E-mail Adressse angeben."
    }
    if(!draft.email.hasErrors && !action.noRequest) {
      draft.email.ckeckCount++
    }
    return
  case "emailUniqueResults":
    if(action.value) {
      draft.email.hasErrors = true
      draft.email.isUnique = false
      draft.email.message = "Die E-Mail wurde schon benutzt."
    } else {
      draft.email.isUnique = true
    }
    return
  case "passwordImmediately":
    draft.password.hasErrors = false
    draft.password.value = action.value
    if(draft.password.value.length > 30) {
      draft.password.hasErrors = true
      draft.password.message = "Password muss kleiner als 20 Zeichen betragen"
    }
    return
  case "passwordAfterDelay":
    if(draft.password.value.length < 12) {
      draft.password.hasErrors = true
      draft.password.message = "Password muss mindestens 12 Zeichen betragen"
    }
    return
  case "submitForm":
    if(!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && !draft.email.isUnique && !draft.password.hasErrors) {
      draft.submitCount++
    }
    return
  }
}


const [state, dispatch] = useImmerReducer(validationReducer, initialState)

useEffect(() => {
  if(state.username.value) {
   const delay = setTimeout(() => dispatch({type: "usernameAfterDelay"}), 900)
   return () => clearTimeout(delay)
  }
}, [state.username.value])

useEffect(() => {
  if(state.email.value) {
   const delay = setTimeout(() => dispatch({type: "emailAfterDelay"}), 900)
   return () => clearTimeout(delay)
  }
}, [state.email.value])

useEffect(() => {
  if(state.password.value) {
   const delay = setTimeout(() => dispatch({type: "passwordAfterDelay"}), 900)
   return () => clearTimeout(delay)
  }
}, [state.password.value])


useEffect(() => {
  if(state.username.checkCount) {
    const cancelRequest = axios.CancelToken.source()

    const fetchUsername = async() => {
      try { 
        const response = await axios.post("/doesUsernameExist", {username: state.username.value}, {cancelToken: cancelRequest.token})
        dispatch({type: "usernameUniqueResults", value: response.data})
      } catch(e) {
        console.error(e)
      }
    }
    fetchUsername()
    return(() => {
      cancelRequest.cancel()
    })
  }
}, [state.username.checkCount])

useEffect(() => {
  if(state.email.checkCount) {
    const cancelRequest = axios.CancelToken.source()

    const fetchEmail = async() => {
      try { 
        const response = await axios.post("/doesEmailExist", {email: state.email.value}, {cancelToken: cancelRequest.token})
        dispatch({type: "emailUniqueResults", value: response.data})
      } catch(e) {
        console.error(e)
      }
    }
    fetchEmail()
    return(() => {
      cancelRequest.cancel()
    })
  }
}, [state.email.checkCount])

useEffect(() => {
  if(state.submitCount) {
    const cancelRequest = axios.CancelToken.source()

    const fetchData = async() => {
      try { 
        const response = await axios.post("/register", {username: state.username.value, email: state.email.value, password: state.password.value}, {cancelToken: cancelRequest.token})
        globalDispatch({type: "login", data: response.data })
        globalDispatch({type: "flashMessages", value: "Willkommen!", color: "success"})
        
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
    return(() => {
      cancelRequest.cancel()
    })
  }
}, [state.submitCount])

const handleSubmit = (e) => {
 e.preventDefault()
 dispatch({type: "usernameImmediately", value: state.username.value})
 dispatch({type: "usernameAfterDelay", value: state.username.value, noRequest: true})
 dispatch({type: "emailImmediately", value: state.email.value})
 dispatch({type: "emailAfterDelay", value: state.email.value, noRequest: true})
 dispatch({type: "passwordImmediately", value: state.password.value})
 dispatch({type: "passwordAfterDelay", value: state.password.value})
 dispatch({type: "submitForm"})
}


  return (
    <>
      <div className="container py-md-5">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Sichere Notizen</h1>
          <p className="lead">Hier kannst du deine Notizen sicher und schnell ansehen und verwalten.</p>
        </div>  
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Name</small>
              </label>
              <input value={state.username.value} onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})} id="username-register" name="username" className="form-control" type="text" placeholder="Name auswählen" autoComplete="off" />
              <CSSTransition timeout={330} in={state.username.hasErrors} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>E-Mail</small>
              </label>
              <input value={state.email.value} onChange={e => dispatch({type: "emailImmediately", value: e.target.value})} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition timeout={330} in={state.email.hasErrors} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Passwort</small>
              </label>
              <input value={state.password.value} onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})} id="password-register" name="password" className="form-control" type="password" placeholder="Erstelle ein Passwort" />
              <CSSTransition timeout={330} in={state.password.hasErrors} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <button className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Registrieren
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Content
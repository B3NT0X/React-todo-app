import React, { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useParams, Link, withRouter } from "react-router-dom"
import axios from "axios"
import Loading from "./Loading"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"

function EditPost(props) {

    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false
    }

    const reducer = (draft, action) => {
        switch(action.type) {
            case "fetchComplete":
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                draft.isFetching = false
                return 
            case "updateValueTitle":
                draft.title.hasErrors = false
                draft.title.value = action.value
                return
            case "updateValueBody":
                draft.body.hasErrors = false
                draft.body.value = action.value
                return
            case "submitRequest":
               if(!draft.title.hasErrors && !draft.body.hasErrors) {
                    draft.sendCount++
               }
                return
            case "savingRequest":
                draft.isSaving = true
                return
            case "savingSuccess":
                draft.isSaving = false
                return
            case "titleRules":
                if(!action.value.trim()) {
                    draft.title.hasErrors = true
                    draft.title.message = "Bitte Titel ausfüllen!"
                }
                return
            case "bodyRules":
                if(!action.value.trim()) {
                    draft.body.hasErrors = true
                    draft.body.message = "Bitte Nachricht ausfüllen!"
                }
              return
            case "notFound":
              draft.notFound = true
              return
        }
    }

    const [state, dispatch] = useImmerReducer(reducer, originalState)

    const submitHandler = e => {
        e.preventDefault()
        dispatch({type: "titleRules", value: state.title.value})
        dispatch({type: "bodyRules", value: state.body.value})
        dispatch({type: "submitRequest"})
    }


    useEffect(() => {
        if(state.sendCount) {
            dispatch({type: "savingRequest"})

        const cancelRequest = axios.CancelToken.source()
        
        const handleSubmit = async() => {
          try {
                await axios.post(`/post/${state.id}/edit`, {title: state.title.value, body: state.body.value, token: globalState.user.token}, {cancelToken: cancelRequest.token })
              
                dispatch({type: "savingSuccess"})
                globalDispatch({type: "flashMessages", value: "Änderung gespeichert!", color: "success"})
                
          } catch(e) {
              console.error(e)
          }
      }
      handleSubmit()
      return () => {
        cancelRequest.cancel()
      }
        }
      }, [state.sendCount])



    useEffect(() => {
        const cancelRequest = axios.CancelToken.source()
  
        const handleSubmit = async() => {
          try {
              const response = await axios.get(`/post/${state.id}`, {cancelToken: cancelRequest.token })
              if(response.data) {
                dispatch({type: "fetchComplete", value: response.data})
                if(globalState.user.username !== response.data.author.username) {
                  globalDispatch({type: "FlashMessages", value: "Du hast keine Erlaubnis diesen Beitrag zu bearbeiten.", color: "danger"})
                  props.history.push("/")
                }
              } else {
                dispatch({type: "notFound"})
              }
                 
              
          } catch(e) {
              console.error(e)
          }
      }
      handleSubmit()
      return(() => {
        cancelRequest.cancel()
      })
      }, [])

      if(state.notFound) {
        return <NotFound />
      }

      if(state.isFetching) return <Loading />

  return (
    <>
     <div className="container container--narrow py-md-5">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo; Zurück</Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small style={{color: "var(--text-color)"}}>Titel</small>
          </label>
          <input onBlur={e => dispatch({type: "titleRules", value: e.target.value})} value={state.title.value} onChange={e => dispatch({type: "updateValueTitle", value: e.target.value})} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
            {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small style={{color: "var(--text-color)"}}>Nachricht</small>
          </label>
          <textarea onBlur={e => dispatch({type: "bodyRules", value: e.target.value})} value={state.body.value} onChange={e => dispatch({type: "updateValueBody", value: e.target.value})} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>{state.isSaving ? "speichert..." : "Änderungen speichern"}</button>
      </form>
    </div>
    </>
  )
}

export default withRouter(EditPost)
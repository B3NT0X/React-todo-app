import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import {useImmer} from "use-immer"
import axios from "axios"
import {Link} from "react-router-dom"

function Search() {
    const globalDispatch = useContext(DispatchContext)
    const globalState = useContext(StateContext)
    const [state, setState] = useImmer({
      searchTerm: "",
      results: [],
      show: "neither",
      requestCount: 0
    })

    useEffect(() => {
        document.addEventListener("keydown", searchKeyPressHandler)
        return () => document.removeEventListener("keydown", searchKeyPressHandler)
    }, [])

    const searchKeyPressHandler = (e) => {
      if(e.keyCode === 27) {
          globalDispatch({type: "closeSearch"})
      }
  }

    useEffect(() => {
      if(state.searchTerm.trim()) {
        setState(draft => {
          draft.show = "loading"
        })
        const delay = setTimeout(() => {
          setState(draft => {
            draft.requestCount++
          })
        }, 700)
  
        return () => clearTimeout(delay)
      } else {
        setState(draft => {
          draft.show = "neither"
        })
      }
    }, [state.searchTerm])

    useEffect(() => {
      if(state.requestCount) {
        const cancelRequest = axios.CancelToken.source()

        const fetchData = async() => {
          try { 
            const response = await axios.post("/search", {searchTerm: state.searchTerm}, {cancelToken: cancelRequest.token})
            setState(draft => {
              draft.results = response.data
              draft.show = "results"
            })
          } catch(e) {
            console.error(e)
          }
        }
        fetchData()
        return(() => {
          cancelRequest.cancel()
        })
      }
    }, [state.requestCount])


    const handleInput = (e) => {
      const value = e.target.value

      setState(draft => {
        draft.searchTerm = value
      })
    }

  return (
    <>
    <div className="search-overlay-top shadow-sm">
      <div className="container container--narrow">
        <label htmlFor="live-search-field" className="search-overlay-icon">
          <i className="fas fa-search"></i>
        </label>
        <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="hier suchen..." />
        <span onClick={() => globalDispatch({type: "closeSearch"})} className="close-live-search">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
    </div>

    <div className="search-overlay-bottom">
      <div className="container container--narrow py-3">
        <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
        <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
          {Boolean(state.results.length) && (
            <div className="list-group shadow-sm">
            <div className="list-group-item active"><strong>{state.results.length} {state.results.length > 1 ? "Ergebnisse" : "Ergebnis"}</strong> "{state.searchTerm}" zur Suche gefunden</div>
            { 
            state.results.map(post => {
              const date = new Date(post.createdDate)
              const formattedDate = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`

              return(
              <Link to={`/post/${post._id}`} key={post._id} onClick={() => globalDispatch({type: "closeSearch"})} className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src={globalState.user.avatar} /> <strong>{post.title}</strong>
                <span className="text-muted small"> von {post.author.username} am {formattedDate} erstellt</span>
              </Link>
              )
            })
            }
          </div>
          )}
          {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Kein Ergebnis gefunden</p>}
        </div>
      </div>
    </div>
  </>
  )
}

export default Search
import React, {useEffect, Suspense} from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
axios.defaults.baseURL = process.env.BACKENDURL || "https://backendformytodoapp.herokuapp.com"


import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//components
import Header from './components/Header';
import Content from "./components/Content";
import Footer from "./components/Footer";
import Container from "./components/Container";
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewPost = React.lazy(() => import("./components/ViewPost"))
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import TheTodo from "./components/TheTodo";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"))
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";

function Main() {

  

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("saveDataToken")),
    darkMode: Boolean(JSON.parse(localStorage.getItem("darkMode"))),
    flashMessages: [],
    flashMessagesColor: "",
    todo: [],
    sidebar: false,
    completed: false,
    popup: false,
    searchIsOpen: false,
    user: {
      token: localStorage.getItem("saveDataToken"),
      username: localStorage.getItem("saveDataName"),
      avatar: localStorage.getItem("saveDataAvatar"),
    }
  }

  const ourReducer = (draft, action) => {
    switch(action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        draft.sidebar = false
        return
      case "flashMessages":
        draft.flashMessages.push({text: action.value, color: action.color})
        return
      case "openSidebar":
        draft.sidebar = true
        return
      case "closeSidebar":
        draft.sidebar = false
        return
      case "darkMode":
        draft.darkMode = !draft.darkMode
        return
      case "addTodo":
        draft.todo.push({id: Date.now(), completed: action.completed, todoValue: action.message})
        return
      case "deleteTodo":
       draft.todo.splice(0, 1)
        return
      case "successTodo":
        const index = draft.todo.findIndex(x => x.id === action.id)
        if(index !== -1) {
          draft.todo[index].completed = !draft.todo[index].completed
        }
        return
      case "popup":
        draft.popup = true
        return
      case "closePopup":
        draft.popup = false
        return
      case "openSearch":
        draft.searchIsOpen = true
        return
      case "closeSearch":
        draft.searchIsOpen = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(state.darkMode))
  }, [state.darkMode])

  useEffect(() => {
    if(state.loggedIn) {
      localStorage.setItem("saveDataToken", state.user.token);
      localStorage.setItem("saveDataName", state.user.username);
      localStorage.setItem("saveDataAvatar", state.user.avatar);
      
    } else {
      localStorage.removeItem("saveDataToken");
      localStorage.removeItem("saveDataName");
      localStorage.removeItem("saveDataAvatar");
    }
  }, [state.loggedIn])

  //check ob der Token noch da ist

  useEffect(() => {
    if(state.loggedIn) {
      const cancelRequest = axios.CancelToken.source()

      const fetchData = async() => {
        try { 
          const response = await axios.post("/checkToken", {token: state.user.token}, {cancelToken: cancelRequest.token})
          if(!response.data) {
            dispatch({type: "logout"})
            dispatch({type: "flasMessages", value: "Bitte einloggen"})
          }
        } catch(e) {
          console.error(e)
        }
      }
      fetchData()
      return(() => {
        cancelRequest.cancel()
      })
    }
  }, [])

  return (    
    <StateContext.Provider value={state}>
    <DispatchContext.Provider value={dispatch}>
      <BrowserRouter>
        <FlashMessages messages={state.flashMessages} />
        <CSSTransition timeout={300} in={state.sidebar} classNames="sidenav" unmountOnExit>
          <Sidebar  />
        </CSSTransition>
            <CSSTransition timeout={330} in={state.sidebar} classNames="menu-margin">
          <Container>
            <Header />
            <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <TheTodo /> : <Content />}
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/post/:id" exact>
                <ViewPost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
            </Suspense>
            <CSSTransition timeout={330} in={state.searchIsOpen} classNames="search-overlay" unmountOnExit>
             <div className="search-overlay">
               <Suspense fallback="">
                 <Search />
               </Suspense>
             </div>
            </CSSTransition>
            <Footer /> 
          </Container>
          </CSSTransition>
        </BrowserRouter>
    </DispatchContext.Provider>
    </StateContext.Provider>
  )
}



ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
    module.hot.accept();
}
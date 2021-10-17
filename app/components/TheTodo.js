import React, { useState, useContext, useEffect } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function TheTodo() {

    const [todoValue, setTodoValue] = useState("")
    const globalDispatch = useContext(DispatchContext)
    const globalState = useContext(StateContext)

      useEffect(() => {
        const items = JSON.parse(localStorage.getItem('todoValue'));
        if (items) {
          globalDispatch({ type: 'getTodo', items });
        }
      }, []);
    
      useEffect(() => {
       localStorage.setItem("todoValue", JSON.stringify(globalState.todo))
      }, [globalState.todo]);

    const handleSubmit = (e) => {
      e.preventDefault()
      if(todoValue) {
        globalDispatch({type: "addTodo", completed: globalState.completed, message: todoValue})
        setTodoValue("")
      } 
      }

     const TodoContent = (props) => {
      return(
        <>
        <li className={"list-group-item m-1 " + (props.completed ? "bg-success" : "bg-dark")}>{props.text}
        <button onClick={() => globalDispatch({type: "deleteTodo"})} className="btn btn-sm btn-danger todoDelete">Löschen</button>
        <button onClick={() => globalDispatch({type: "successTodo", id: props.id})} className="btn  btn-sm btn-primary ml-1">Erledigt</button>
        </li>
        </>
      )
    }

    const capitalize = str => {
      return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase()
    }

  return ( 
    <div className="container">
      <h2 className="pt-5">Hallo <strong>{capitalize(globalState.user.username)}</strong></h2><br />
      <form onSubmit={handleSubmit}>
          <input value={todoValue} onChange={e => {setTodoValue(e.target.value)}} type="text" className="todoInput" />
          <button type="submit" className="todoSubmit btn-success rounded ml-2">Hinzufügen</button>
      </form>
      <div className="card bg-secondary mt-2" style={{minHeight: "400px", paddingBottom: "57px"}}>
      <ul className="list-group">
      {globalState.todo
      .map((value, index) => {
          return ( 
            <TodoContent key={index} completed={value.completed} id={value.id} text={value.todoValue} />
          )
      })}
      </ul>
      </div>
    </div>
  )
}

export default TheTodo
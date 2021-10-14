import React, {useState, useEffect, useToggle} from "react";

function Todo() {
     
    const [list, setList] = useState([])
    const [name, setName] = useState()
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
      if(localStorage.getItem("todoValue")) {
        setList(JSON.parse(localStorage.getItem("todoValue")))
      }
    }, [])
    
    useEffect(() => {
      localStorage.setItem("todoValue", JSON.stringify(list))
    }, [list])

    const handleSubmit = (e) => {
      if(name) {
        e.preventDefault();
        setList(item => item.concat({name, completed:false, id: Date.now()}))
        setName("")
      } else {
        alert("leeres Input Feld")
      } 
    }

    const ListItem = (props) => {

      const deleteHandler = () => {
        props.setList(prev => prev.filter(testitem => testitem.id !== props.id))
      }

      const success = () => {
        setList(list.map(item => { 
         if(item.id === props.id) {
          
          
          return {...item, completed: !item.completed}
    
         }
             return item
          }))
         console.log(completed)
       }
      
      return(
        <>
        <li style={{color: props.completed ? "#fff" : "#444"}} className={`list-group-item m-1 ${props.completed ? "bg-dark" : "bg-success"}`}>
          {props.name}
        </li>
        <button onClick={deleteHandler} className="btn btn-sm btn-danger todoDelete">Löschen</button>
        <button onClick={success} className="btn  btn-sm btn-primary ml-1">Erledigt</button>
        </>
      )
    }

    const capitalize = str => {
    return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase()
  }

  
    
  return (
    <div className="container">
     <h2 className="pt-5">Hallo <strong>{capitalize(localStorage.getItem("saveDataName"))}</strong></h2><br />
        <form onSubmit={handleSubmit}>
        <input value={name || ""} onChange={e => setName(e.target.value)} type="text"  className="todoInput"/> 
        <button type="submit" className="todoSubmit btn-success rounded ml-2">Hinzufügen</button>
        </form>
        <div className="card bg-secondary mt-2" style={{minHeight: "400px", paddingBottom: "57px"}}>
        <ul className="list-group">
        {list.map((listvalue, index) => <ListItem setList={setList} completed={listvalue.completed} list={list} id={listvalue.id} key={index} name={listvalue.name} />
        )}
        </ul>
        </div>
      </div>
  )


}

export default Todo
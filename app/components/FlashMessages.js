import React, {useContext} from "react"
import StateContext from "../StateContext"


function FlashMessages(props) {
  const globalState = useContext(StateContext)

  return (
    <>
      <div className="floating-alerts">
         {props.messages.map((msg, index) => {
             return(
                 <div key={index} className={`alert alert-${msg.color} text-center floating-alert shadow-sm`}>
                     {msg.text}
                 </div>
             )
         })}
      </div>
    </>
  )
}

export default FlashMessages
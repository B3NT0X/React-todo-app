import React from "react"
import {Link} from "react-router-dom"

function NotFound() {
  return (
    <>
      <div className="container">
                <div className="row">
                  <h2>Whoops, Seite nicht gefunden...</h2>
                  <p className="lead text-muted">Hier kommst du zurück zur <Link to={"/"}>Homepage</Link></p>
                </div>
              </div>
    </>
  )
}

export default NotFound
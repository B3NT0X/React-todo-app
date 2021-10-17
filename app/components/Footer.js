import React from "react"

function Footer() {
  return (
    <>
      <footer className="border-top text-center small text-muted py-3">
        <p><a href="/" className="mx-1">Home</a> | <a className="mx-1" href="/about-us">Über uns</a> | <a className="mx-1" href="/">Datenschutz</a></p>
        <p className="m-0">Copyright &copy; 2021 <a href="/" className="text-muted">Brain Notes</a> Alle Rechte vorbehalten.</p>
      </footer>
    </>
  )
}

export default Footer
import {BrowserRouter, Route, Routes} from "react-router-dom"
import React from "react"
import Auth from "./Auth";
import Board from "./Board";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/board/:id" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
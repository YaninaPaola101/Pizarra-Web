import { useEffect, useRef, useState } from "react";
import Canvas from "./components/Canvas";
import Inicio from "./components/Inicio";
import { Route,Routes,BrowserRouter as Router,} from "react-router-dom";
//hola

function App(){
    return (
        <div>
          <h1>Private Room</h1>
          <Router>
          <Routes>
            <Route path="/:room" element={<Canvas />} />
            <Route path="*" element={<Inicio />} />
          </Routes>
          </Router>

        </div>
      );
    }
export default App;
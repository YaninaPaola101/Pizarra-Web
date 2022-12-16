//import { Router } from "express";
import React from "react";
import { useState } from "react";
import './inicio.css';
import { useNavigate } from 'react-router-dom';
function Inicio  () {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/${room}`);
      }
      
    return (
            <div id="login-box">
                <h1>Login</h1>
                <div className="formu">
                    <form onSubmit={handleSubmit}>
                        <label>Ingresa tu nombre:
                        <i className="fa fa-user-circle" aria-hidden="true"></i>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>Ingresa codigo de sala:
                        <i className="fa fa-key" aria-hidden="true"></i>
                            <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                        </label>
                        <input type="submit" id="boton"/>
                    </form>

                </div>
            </div>
    )
}
export default Inicio


import React from "react";
const Paletas=({titulo,cambio})=>{
    return (
        <div id="Colores">
				<h1>{titulo}</h1>
				<button id="rojo" onClick={() => cambio("red")}></button>
				<button id="amarillo" onClick={() => cambio("yellow")}></button>
				<button id="verde" onClick={() => cambio("green")}></button>
				<button id="azul" onClick={() => cambio("blue")}></button>
				<button id="naranja" onClick={() => cambio("orange")}></button>
				<button id="negro" onClick={() => cambio("black")}></button>
                <input
				className="Colorea"
				type="color"
				onChange={(e) => {
					cambio(e.target.value);
				}}
			/>
			</div>
    )
}
export default Paletas
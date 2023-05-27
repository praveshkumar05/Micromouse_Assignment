import React, { useState } from "react";
import Grid from "./Grid";
import "./InputForm.css";

function InputForm() {
  const [rows, setRows] = useState();
  const [cols, setCols] = useState();
  const [showGrid, setShowGrid] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowGrid(true);
  };

  const handleRowsChange = (event) => {
    setRows(event.target.value);
  };

  const handleColsChange = (event) => {
    setCols(event.target.value);
  };

  return (
    <>
      <div className="contaner">
        <div className="row ">
          <div  className="col d-flex  bg-black flex-column justify-content-center align-content-center" style={{ minHeight: "100vh",}}>
             
            {!showGrid ? (
                <>
                <h3 className="text-center"><strong  style={{color:"whitesmoke"}} >Enter The dimension of Grid</strong> </h3>
                <form 
                 
                 onSubmit={handleSubmit}
                 style={{
                  // backgroundColor: "#f9f9f9",
                   padding: "20px",
                   borderRadius: "10px",
                   boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                   display: "flex",
                   flexDirection: "column",
                   alignItems: "center",
                 }}
               >
                 <label style={{color:"whitesmoke"}}>
                    Rows:
                   <input
                     type="number"
                     value={rows}
                     onChange={handleRowsChange}
                    
                     className="form-control"
                     required={true}
                   />
                 </label>
                 <br />
                 <label style={{color:"whitesmoke"}}>
                   Columns:
                   <input
                     type="number"
                     value={cols}
                     onChange={handleColsChange}
                     className="form-control"
                     required={true}
                   />
                 </label>
                 <br />
                 <button
                   type="submit"
                   style={{
                     marginTop: "10px",
                     padding: "10px 20px",
                     borderRadius: "5px",
                     border: "none",
                     backgroundColor: "#4CAF50",
                     color: "white",
                     fontWeight: "bold",
                     cursor: "pointer",
                   }}
                 >
                   Show Grid
                 </button>
               </form>
                </>
               
            ) : null}
            {showGrid && (
              <Grid row={rows} col={cols} setShowGrid={setShowGrid} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InputForm;

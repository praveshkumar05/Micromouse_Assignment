import React, { useEffect, useState } from "react";
import "./Grid.css";
function Grid({ row, col, setShowGrid }) {
  let rows=row,cols=col;
  
  const [block, setBlock] = useState(false);
  const [start, setStart] = useState(false);
  const [destination, setDestination] = useState(false);
  const [sr,setSr]=useState();
  const [sc,setSc]=useState();
  const [dr,setDr]=useState();
  const [dc,setDc]=useState();
  const [dragging,setDragging]=useState(false);
  const [cellSize, setCellSize] = useState(0);
  const [path, setPath] = useState([]);
  let value = 0;
  let columns=col;
  let arr=[]
    // creating two-dimensional array
    for (let i = 0; i < rows; i++) {
      arr[i] = [];
      for (let j = 0; j < columns; j++) {
        arr[i][j] = value;
      }
    } 

  const [gridValues, setGridValues] = useState(arr);
    
  const handleChange = (event, row, col) => {
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 1 ? 0 : 1;
    newGridValues[row][col] =x;
    setGridValues(newGridValues);
     console.log(gridValues);
  };
  const handleChange2 = (event, row, col) => {
    setSr(row);
    setSc(col);
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 5 ? 0 : 5;
    newGridValues[row][col] = x;
    

    setStart(true);
  };
  const handleChange3 = (event, row, col) => {
    setDr(row);
    setDc(col);
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 2 ? 0 : 2;
    newGridValues[row][col] = x;
    
    setDestination(true);
  };
  const bfs = () => {
    let queue = [[sr, sc]];
    let visited = new Set();
    let parent = {};
    visited.add(sr + "," + sc);

    while (queue.length) {
      let [row, col] = queue.shift();

      if (row === dr && col === dc) {
        break;
      }

      let neighbors = [        [row - 1, col], // top
        [row, col + 1], // right
        [row + 1, col], // bottom
        [row, col - 1], // left
      ];

      for (let [r, c] of neighbors) {
        if (
          r >= 0 &&
          r < rows &&
          c >= 0 &&
          c < cols &&
          !visited.has(r + "," + c) &&
          gridValues[r][c] !== 1
        ) {
          visited.add(r + "," + c);
          parent[r + "," + c] = [row, col];
          queue.push([r, c]);
        }
      }
    }

    let path = [];

    if (parent[dr + "," + dc]) {
      let curr = [dr, dc];
      while (curr) {
        path.push(curr);
        curr = parent[curr[0] + "," + curr[1]];
      }
    }
    setPath(path.reverse());
    let newGridValues = [...gridValues];
    let delay = 1000; // 1 second delay
    path.forEach(([r, c], i) => {
      setTimeout(() => {
        newGridValues[r][c] = 3;
        setGridValues(newGridValues);
      }, delay * i);
    });
    
  };
  const handlReset=()=>{
    setGridValues(arr) ;
    setPath([]);
    setBlock(false);
    setStart(false);
    setDestination(false);
    setShowGrid(false);
  }

  useEffect(() => {
    if (start && destination) {
      bfs();
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cellWidth = Math.floor(width / cols);
    const cellHeight = Math.floor(height / rows);
    let size =Math.min(cellWidth, cellHeight);
    size=Math.min(50,size);
    
    setCellSize(size);
    //eslint-disable-next-line
  }, [start, destination,row,col]);
  return (
    <table>
      {!block ? (
        <tbody style={{ textAlign: "center" }}>
            <div>Create the Block </div>
          <div>
            {
              gridValues.map((rowValues, rowIndex) => (
              <tr key={rowIndex} >
                
                {rowValues.map((cellValue, colIndex) => (
                  <td key={colIndex}>
                    <div
                      style={{
                        width: `${cellSize}px`, height: `${cellSize}px`,
                        backgroundColor: cellValue === 1
                            ? "red"
                            : cellValue === 2
                            ? "green"
                            : cellValue === 5
                            ? "blue"
                            : "white",
                      }}
                      onClick={(event) =>{
                        setDragging(!dragging);
                        // handleChange(event, rowIndex, colIndex)
                      }
                         
                      }
                    onMouseDown={(event) => {
                     
                      handleChange(event, rowIndex, colIndex);
                    }}
                   onMouseUp={() => setDragging(false)}
                    onMouseEnter={(event) => {
                      if (dragging) {
                        handleChange(event, rowIndex, colIndex);
                      }
                   }}
                  
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </div>
          <div>
            <button  style={{
              backgroundColor: "Green",
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "10px 20px",
              fontWeight: "bold",
              cursor: "pointer"
            }}onClick={() => setBlock(true)}>Finalise Blocking</button>
          </div>
        </tbody>
      ) : !start ? (
        <tbody style={{ textAlign: "center" }}>
          <div>
            <h3>Choose A Starting Point </h3>
            {gridValues.map((rowValues, rowIndex) => (
              <tr key={rowIndex}>
                  
                {rowValues.map((cellValue, colIndex) => (
                  <td key={colIndex}>
                    <div
                      style={{
                        width: `${cellSize}px`, height: `${cellSize}px`,
                        backgroundColor:
                          cellValue === 1
                            ? "red"
                            : cellValue === 2
                            ? "green"
                            : cellValue === 5
                            ? "blue"
                            : "white",
                      }}
                      onClick={(event) =>
                        handleChange2(event, rowIndex, colIndex)
                      }
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </div>
        </tbody>
      ) : !destination ? (
        <tbody style={{ textAlign: "center" }}>
          <div>
            <h3>Choose A destination Point </h3>
             
            {gridValues.map((rowValues, rowIndex) => (
              <tr key={rowIndex}>
                
                {rowValues.map((cellValue, colIndex) => (
                  <td key={colIndex}>
                    <div
                      style={{
                        width: `${cellSize}px`, height: `${cellSize}px`,
                        backgroundColor:
                          cellValue === 1
                            ? "red"
                            : cellValue === 2
                            ? "green"
                            : cellValue === 5
                            ? "blue"
                            : "white",
                      }}
                      onClick={(event) =>
                        handleChange3(event, rowIndex, colIndex)
                      }
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </div>
        </tbody>
      ) : (
        <tbody style={{ textAlign: "center" }}>
          <div>
            <h3  >Here Is Your Shortest Path</h3>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: "red",
                    }}
                  ></div>
                  <div>Blocking Point</div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: "green",
                    }}
                  ></div>
                  <div>Destinatin Point</div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: "blue",
                    }}
                  ></div>
                  <div>Starting Point</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              {
                gridValues.map((rowValues, rowIndex) => (
                <tr key={rowIndex}>
                  
                  {
                      rowValues.map((cellValue, colIndex) => (
                      <td key={colIndex}>
                        <div
                          style={{
                            width: `${cellSize}px`, height: `${cellSize}px`,
                            backgroundColor:
                              cellValue === 1
                                ? "red"
                                : cellValue === 2
                                ? "green"
                                : cellValue === 5
                                ? "blue"
                                : cellValue===3
                                ?'purple':'white'
                          }}
                        ></div>
                      </td>
                    )) 
                  }
                </tr>
              ))}
            </div>
            {

                path.forEach((arr, index) => {
                  setTimeout(() => {
                    let newGridValues = [...gridValues];
                    newGridValues[arr[0]][arr[1]] = 3;
                    setGridValues(newGridValues);
                  },index * 40)
                }) 
            }
            <div>
            </div>
           
          </div>
      <div>
          <button
            onClick={handlReset}
            style={{
              backgroundColor: "Green",
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "10px 20px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Reset Grid
         </button>
      </div>
        </tbody>
        
      )}
    </table>
  );
}
export default Grid;

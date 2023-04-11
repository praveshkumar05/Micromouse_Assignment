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
  const [val,setVal]=useState([]);
  
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
    let brr=[]
    // creating two-dimensional array
    for (let i = 0; i < rows; i++) {
      brr[i] = [];
      for (let j = 0; j < columns; j++) {
        brr[i][j] = null;
      }
    } 

  const [gridValues, setGridValues] = useState(arr);
  const [distance,setDistance]=useState(arr);
    
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
    
  };
  const handlReset=()=>{
    setGridValues(arr) ;
    setPath([]);
    setBlock(false);
    setStart(false);
    setDestination(false);
    setShowGrid(false);
  }
  const dfs=(startRow, startCol, rows, cols, grid)=> {
  // Create a 2D array to hold the distances for each cell
  const distances = brr;

  // Create a queue for the DFS
  const queue = [];

  // Add the starting cell to the queue and set its distance to 0
  queue.push({ row: startRow, col: startCol, distance: 0 });
  distances[startRow][startCol] = 0;

  // Define a function to check if a given cell is valid and not blocked
  function isValid(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols && grid[row][col] !== 1;
  }

  // Perform the DFS
  while (queue.length > 0) {
    // Dequeue the next cell
    const { row, col, distance } = queue.shift();

    // Check each of the cell's neighbors
    const neighbors = [
      { row: row - 1, col: col }, // top
      { row: row + 1, col: col }, // bottom
      { row: row, col: col - 1 }, // left
      { row: row, col: col + 1 }, // right
    ];

    for (const neighbor of neighbors) {
      const { row: neighborRow, col: neighborCol } = neighbor;

      // If the neighbor is valid and hasn't been visited yet, add it to the queue
      if (isValid(neighborRow, neighborCol) && distances[neighborRow][neighborCol] === null) {
        const neighborDistance = distance + 1;
        queue.push({ row: neighborRow, col: neighborCol, distance: neighborDistance });
        distances[neighborRow][neighborCol] = neighborDistance;
      }
    }
  }
  console.log(distances);
  setDistance(distances);
}


  useEffect(() => {
   
    if (start&& destination) {
      bfs();
    }
    else if(start)
    {
      dfs(sr,sc,rows,cols,gridValues);
      console.log(distance);
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
                     
                         
                    
                    onMouseDown={(event) => {
                        setDragging(true);
                      handleChange(event, rowIndex, colIndex);
                    }}
                   onMouseUp={() => setDragging(false)}
                    onMouseEnter={(event) => {
                      if (dragging) {
                        handleChange(event, rowIndex, colIndex);
                      }
                   }}>

                   </div>
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
                    >
                   
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </div>
        </tbody>
      ) : (
        <tbody style={{ textAlign: "center" }}>
          <div>
            <h3  > {path.size==0?"path is imaginary like yoour cursh": "Here Is Your Shortest Path"}</h3>
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
                        >
                         
                        </div>
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

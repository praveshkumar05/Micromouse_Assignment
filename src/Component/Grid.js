import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./Grid.css";

function Grid({ row, col, setShowGrid }) {
  let rows = row, cols = col;
  //console.log("hhhh");
  const [block, setBlock] = useState(false);
  const [start, setStart] = useState(false);
  const [destination, setDestination] = useState(false);
  const [sr, setSr] = useState();
  const [sc, setSc] = useState();
  const [dr, setDr] = useState();
  const [dc, setDc] = useState();
  const [dragging, setDragging] = useState(false);
  const [cellSize, setCellSize] = useState(0);
  const [cellwidth, setcellWidth] = useState(0);
  const [cellheight, setcellHeight] = useState(0);
  const [path, setPath] = useState([]);
  // const [val,setVal]=useState([]); const [dfsCalled, setDfsCalled] = useState(false);

  let value = 0;
  let columns = col;
  let arr = []
  // creating two-dimensional array
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
      arr[i][j] = value;
    }
  }
  let brr = []
  // creating two-dimensional array
  for (let i = 0; i < rows; i++) {
    brr[i] = [];
    for (let j = 0; j < columns; j++) {
      brr[i][j] = null;
    }
  }

  const [gridValues, setGridValues] = useState(arr);
  const [distance] = useState(arr);

  const handleChange = (event, row, col) => {
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 1 ? 0 : 1;
    newGridValues[row][col] = x;
    setGridValues(newGridValues);
    // console.log(gridValues);
  };
  const handleChange2 = (event, row, col) => {
    setSr(row);
    setSc(col);
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 5 ? 0 : 5;
    newGridValues[row][col] = x;
    setGridValues(newGridValues);
    setStart(true);
    //console.log(test);
  };
  const handleChange3 = (event, row, col) => {
    setDr(row);
    setDc(col);
    let newGridValues = [...gridValues];
    let x = gridValues[row][col] === 2 ? 0 : 2;
    newGridValues[row][col] = x;
    setGridValues(newGridValues);
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
      let neighbors = [[row - 1, col], // top
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
    //console.log(path);
  };
  const handlReset = () => {
    setGridValues(arr);
    setPath([]);
    setBlock(false);
    setStart(false);
    setDestination(false);
    setShowGrid(false);
  }
  const handleStarandFinal = () => {

    path.forEach((arr, index) => {
      let newGridValues = [...gridValues];
      newGridValues[arr[0]][arr[1]] = 0;
      setGridValues(newGridValues);
    });

    const newGridValues = [...gridValues];
    newGridValues[sr][sc] = 0;
    newGridValues[dr][dc] = 0;
    setGridValues(newGridValues);

    setStart(false);
    setDestination(false);
  }

  useEffect(() => {
    if (start && destination) {
      bfs();
      //dfs(sr,sc,dr,dc,rows,cols,gridValues);
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.floor(width / cols);
    const y = Math.floor(height / rows);
    setcellHeight(y);
    setcellWidth(x);
    let size = Math.min(x, y);
    size = Math.min(50, size);
    //console.log(size);
    setCellSize(size);
    //eslint-disable-next-line
  }, [start, destination]);


  useEffect(() => {
    //console.log(distance);
    //console.log(path);



    path.forEach((arr, index) => {
      setTimeout(() => {
        let newGridValues = [...gridValues];
        newGridValues[arr[0]][arr[1]] = 3;
        setGridValues(newGridValues);
      }, index * 40);
    });
    //eslint-disable-next-line
  }, [path]);

  return (
    <>

      <table>
        {!block ? (
          <tbody style={{ textAlign: "center" }}>
            <div className=" row d-flex justify-content-between ">
              <div className="col-md-6 px-3 py-3"> <strong style={{ color: 'whitesmoke' }}>Create the Block by selecting the box</strong> </div>
              <div className="col-md-6 px-3 py-3">
                <button className="bg-success px-3 py-3"
                  style={{

                    border: "1px solid gray",
                    borderRadius: "5px",

                    fontWeight: "bold",
                    cursor: "pointer"
                  }}

                  onClick={() => setBlock(true)}>
                  <strong>Finalise Blocking</strong></button>
              </div>

            </div>
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

          </tbody>
        ) : !start ? (
          <tbody style={{ textAlign: "center" }}>
            <div>
              <h3 className="py-5 my-3" style={{ color: "whitesmoke" }}>Choose A Starting Point </h3>
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
            <div >
              <h3 className="py-5 my-3" style={{ color: "whitesmoke" }}>Choose A Destination Point </h3>

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
          <>

            <tbody >
              <div className="row p-4">
                <div className="col-md-6" style={{ display: 'flex' }}>
                  <button
                    onClick={handlReset}
                    className="px-md-5 py-md-2 bg-secondary"
                    style={{ borderRadius: "5px", cursor: "pointer" }}
                  >
                    <strong>Reset Grid</strong> 
                  </button>
                </div>
                <div className="col-md-6">
                <button
                    onClick={handleStarandFinal}
                    className="px-md-5 py-md-2 bg-secondary"
                    style={{ borderRadius: "5px", cursor: "pointer" }}
                  >
                   <strong>Reset Destination</strong>
                </button>
                </div>
              </div>

              <h2 style={{ color: "whitesmoke" }} > {path.length === 0 ? "path is imaginary like your crush" : "Here Is Your Shortest Path"}</h2>
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
                                        : cellValue === 3
                                          ? 'purple'
                                          : cellValue === 4 ? 'yellow'
                                            : 'white'
                              }}
                            >
                            </div>
                          </td>
                        ))
                      }
                    </tr>
                  ))}
              </div>


              <div>
              </div>


            </tbody>

          </>
        )}
      </table>
    </>
  );
}
export default Grid;

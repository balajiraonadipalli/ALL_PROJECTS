
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   ArcElement
// } from 'chart.js';
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import { 
//   SciChart3DSurface, 
//   NumericAxis3D, 
//   XyzDataSeries3D, 
//   ScatterRenderableSeries3D, 
//   SpherePointMarker3D,
//   SciChartSurface
// } from 'scichart';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   ArcElement
// );

// // Configure SciChart WASM paths before any component renders
// SciChartSurface.configure({
//   wasmUrl: '/static/js/scichart3d.wasm',
//   dataUrl: '/static/js/scichart3d.data'
// });

// const App = () => {
//   // State management
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState(null);
//   const [chartType, setChartType] = useState('bar');
//   const [xAxis, setXAxis] = useState('');
//   const [yAxis, setYAxis] = useState('');
//   const [zAxis, setZAxis] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Refs for chart instances
//   const sciChart3DRef = useRef(null);
//   const sciChart3DSurface = useRef(null);
//   const chartInstance2D = useRef(null);

//   // Cleanup effects
//   useEffect(() => {
//     return () => {
//       // Cleanup 3D chart
//       if (sciChart3DSurface.current) {
//         sciChart3DSurface.current.delete();
//         sciChart3DSurface.current = null;
//       }
//       // Cleanup 2D chart
//       if (chartInstance2D.current) {
//         chartInstance2D.current.destroy();
//         chartInstance2D.current = null;
//       }
//     };
//   }, []);

//   // File upload handler
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setError('');
//   };

//   // Data upload and processing
//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file first');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch('http://localhost:5000/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Upload failed');

//       const result = await response.json();
//       setData(result.data);
//     } catch (err) {
//       setError(err.message || 'Failed to upload file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize 3D chart with error handling
//   const init3DChart = useCallback(async (chartData) => {
//     try {
//       // Cleanup previous chart
//       if (sciChart3DSurface.current) {
//         sciChart3DSurface.current.delete();
//         sciChart3DSurface.current = null;
//       }

//       if (!sciChart3DRef.current) return;

//       // Create new 3D surface
//       const { sciChart3DSurface: surface, wasmContext } = await SciChart3DSurface.create(
//         sciChart3DRef.current.id
//       );
//       sciChart3DSurface.current = surface;

//       // Configure axes
//       surface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: xAxis });
//       surface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: yAxis });
//       surface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: zAxis });

//       // Create scatter series
//       const scatterSeries = new ScatterRenderableSeries3D(wasmContext, {
//         pointMarker: new SpherePointMarker3D(wasmContext, {
//           size: 5,
//           fill: "#FF6600"
//         })
//       });

//       // Populate data series
//       const xyzDataSeries = new XyzDataSeries3D(wasmContext);
//       chartData.forEach(item => {
//         xyzDataSeries.append(item.x, item.y, item.z);
//       });

//       scatterSeries.dataSeries = xyzDataSeries;
//       surface.renderableSeries.add(scatterSeries);

//     } catch (error) {
//       console.error("3D Chart initialization error:", error);
//       setError("Failed to initialize 3D visualization");
//     }
//   }, [xAxis, yAxis, zAxis]);

//   // Render appropriate chart based on selection
//   const renderChart = () => {
//     if (!data || !xAxis || !yAxis) return null;

//     // Handle 3D scatter plot
//     if (chartType === '3d-scatter') {
//       if (!zAxis) return <div className="error">Please select Z-Axis for 3D visualization</div>;
      
//       const chartData = data.map(item => ({
//         x: parseFloat(item[xAxis]),
//         y: parseFloat(item[yAxis]),
//         z: parseFloat(item[zAxis])
//       })).filter(item => !isNaN(item.x) && !isNaN(item.y) && !isNaN(item.z));
      
//       if (chartData.length === 0) return <div className="error">Invalid data for 3D visualization</div>;
      
//       init3DChart(chartData);
//       return <div id="scichart3d-container" ref={sciChart3DRef} style={{ width: "100%", height: "500px" }} />;
//     }

//     // Prepare 2D chart data
//     const labels = data.map(item => item[xAxis]);
//     const values = data.map(item => parseFloat(item[yAxis])).filter(val => !isNaN(val));

//     if (values.length === 0) return <div className="error">Invalid data for visualization</div>;

//     const chartData = {
//       labels,
//       datasets: [{
//         label: yAxis,
//         data: values,
//         backgroundColor: getBackgroundColor(),
//         borderColor: getBorderColor(),
//         borderWidth: 1,
//       }],
//     };

//     const options = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { position: 'top' },
//         title: { display: true, text: `${yAxis} by ${xAxis}` },
//       },
//     };

//     // Return appropriate 2D chart
//     switch (chartType) {
//       case 'bar': return <Bar ref={chartInstance2D} data={chartData} options={options} />;
//       case 'line': return <Line ref={chartInstance2D} data={chartData} options={options} />;
//       case 'pie': return <Pie ref={chartInstance2D} data={chartData} options={options} />;
//       default: return <Bar ref={chartInstance2D} data={chartData} options={options} />;
//     }
//   };

//   // Helper functions for chart styling
//   const getBackgroundColor = () => {
//     switch (chartType) {
//       case 'bar': return 'rgba(54, 162, 235, 0.5)';
//       case 'pie': return [
//         'rgba(255, 99, 132, 0.5)',
//         'rgba(54, 162, 235, 0.5)',
//         'rgba(255, 206, 86, 0.5)',
//         'rgba(75, 192, 192, 0.5)',
//         'rgba(153, 102, 255, 0.5)',
//       ];
//       default: return 'rgba(75, 192, 192, 0.5)';
//     }
//   };

//   const getBorderColor = () => {
//     switch (chartType) {
//       case 'bar': return 'rgba(54, 162, 235, 1)';
//       case 'pie': return [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//       ];
//       default: return 'rgba(75, 192, 192, 1)';
//     }
//   };

//   // Get available column options from data
//   const getColumnOptions = () => {
//     if (!data || data.length === 0) return [];
//     return Object.keys(data[0]).filter(key => key !== 'id'); // Exclude potential id fields
//   };

//   return (
//     <div className="container">
//       <h1>Advanced Data Visualizer</h1>
      
//       <div className="upload-section">
//         <input 
//           type="file" 
//           accept=".xlsx,.xls,.csv" 
//           onChange={handleFileChange} 
//           disabled={loading}
//         />
//         <button onClick={handleUpload} disabled={loading}>
//           {loading ? 'Uploading...' : 'Upload & Process'}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}

//       {data && (
//         <div className="chart-controls">
//           <div>
//             <label>Chart Type:</label>
//             <select 
//               value={chartType} 
//               onChange={(e) => setChartType(e.target.value)}
//               disabled={loading}
//             >
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//               <option value="pie">Pie Chart</option>
//               <option value="3d-scatter">3D Scatter Plot</option>
//             </select>
//           </div>

//           <div>
//             <label>X-Axis:</label>
//             <select 
//               value={xAxis} 
//               onChange={(e) => setXAxis(e.target.value)}
//               disabled={loading}
//             >
//               <option value="">Select column</option>
//               {getColumnOptions().map((col) => (
//                 <option key={`x-${col}`} value={col}>
//                   {col}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Y-Axis:</label>
//             <select 
//               value={yAxis} 
//               onChange={(e) => setYAxis(e.target.value)}
//               disabled={loading}
//             >
//               <option value="">Select column</option>
//               {getColumnOptions().map((col) => (
//                 <option key={`y-${col}`} value={col}>
//                   {col}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {chartType === '3d-scatter' && (
//             <div>
//               <label>Z-Axis:</label>
//               <select 
//                 value={zAxis} 
//                 onChange={(e) => setZAxis(e.target.value)}
//                 disabled={loading}
//               >
//                 <option value="">Select column</option>
//                 {getColumnOptions().map((col) => (
//                   <option key={`z-${col}`} value={col}>
//                     {col}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="chart-container">
//         {renderChart()}
//       </div>

//       <style jsx>{`
//         .container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 20px;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
//         h1 {
//           color: #2c3e50;
//           margin-bottom: 20px;
//           text-align: center;
//           font-size: 2.2rem;
//         }
//         .upload-section {
//           margin: 20px 0;
//           display: flex;
//           gap: 15px;
//           align-items: center;
//           justify-content: center;
//         }
//         .upload-section input {
//           padding: 10px;
//           border: 2px solid #ddd;
//           border-radius: 6px;
//           width: 300px;
//           transition: border 0.3s;
//         }
//         .upload-section input:focus {
//           border-color: #4CAF50;
//           outline: none;
//         }
//         .upload-section button {
//           padding: 10px 20px;
//           background-color: #4CAF50;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-weight: bold;
//           transition: background-color 0.3s;
//         }
//         .upload-section button:hover:not(:disabled) {
//           background-color: #45a049;
//         }
//         .upload-section button:disabled {
//           background-color: #cccccc;
//           cursor: not-allowed;
//         }
//         .chart-controls {
//           display: flex;
//           gap: 25px;
//           margin: 25px 0;
//           flex-wrap: wrap;
//           justify-content: center;
//         }
//         .chart-controls div {
//           display: flex;
//           flex-direction: column;
//           min-width: 220px;
//         }
//         .chart-controls label {
//           margin-bottom: 8px;
//           font-weight: 600;
//           color: #444;
//           font-size: 0.95rem;
//         }
//         .chart-controls select {
//           padding: 10px;
//           border: 2px solid #ddd;
//           border-radius: 6px;
//           background-color: white;
//           font-size: 0.9rem;
//           transition: border 0.3s;
//         }
//         .chart-controls select:focus {
//           border-color: #4CAF50;
//           outline: none;
//         }
//         .chart-container {
//           margin-top: 30px;
//           height: 550px;
//           width: 100%;
//           border: 1px solid #eee;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           padding: 10px;
//           background-color: white;
//         }
//         .error {
//           color: #d32f2f;
//           margin: 15px 0;
//           padding: 12px;
//           background-color: #ffebee;
//           border-radius: 6px;
//           border: 1px solid #ef9a9a;
//           text-align: center;
//           font-weight: 500;
//         }
//         @media (max-width: 768px) {
//           .container {
//             padding: 15px;
//           }
//           .chart-controls {
//             flex-direction: column;
//             gap: 15px;
//           }
//           .chart-controls div {
//             min-width: 100%;
//           }
//           .upload-section {
//             flex-direction: column;
//           }
//           .upload-section input {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;

import React from 'react'
import LoginPage from "./LoginPage"
import { Route,Routes } from 'react-router-dom'
import Home from './Home'

function App() {
  return (
    <div> 
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path="/Home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App

// // src/components/App.js
// import React, { useState } from 'react';
// import { Bar, Line, Pie } from 'react-chartjs-2';
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

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState(null);
//   const [chartType, setChartType] = useState('bar');
//   const [xAxis, setXAxis] = useState('');
//   const [yAxis, setYAxis] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file first');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://localhost:5000/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const result = await response.json();
//       setData(result.data);
//       console.log(result);
//       console.log(result.data);
//     } catch (err) {
//       setError(err.message || 'Failed to upload file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderChart = () => {
//     if (!data || !xAxis || !yAxis) return null;

//     // Extract labels and data values
//     const labels = data.map(item => item[xAxis]);
//     const values = data.map(item => item[yAxis]);

//     const chartData = {
//       labels,
//       datasets: [
//         {
//           label: yAxis,
//           data: values,
//           backgroundColor:
//             chartType === 'bar'
//               ? 'rgba(54, 162, 235, 0.5)'
//               : chartType === 'pie'
//               ? [
//                   'rgba(255, 99, 132, 0.5)',
//                   'rgba(54, 162, 235, 0.5)',
//                   'rgba(255, 206, 86, 0.5)',
//                   'rgba(75, 192, 192, 0.5)',
//                   'rgba(153, 102, 255, 0.5)',
//                 ]
//               : 'rgba(75, 192, 192, 0.5)',
//           borderColor:
//             chartType === 'bar'
//               ? 'rgba(54, 162, 235, 1)'
//               : chartType === 'pie'
//               ? [
//                   'rgba(255, 99, 132, 1)',
//                   'rgba(54, 162, 235, 1)',
//                   'rgba(255, 206, 86, 1)',
//                   'rgba(75, 192, 192, 1)',
//                   'rgba(153, 102, 255, 1)',
//                 ]
//               : 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//         },
//       ],
//     };

//     const options = {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: `${yAxis} by ${xAxis}`,
//         },
//       },
//     };

//     switch (chartType) {
//       case 'bar':
//         return <Bar data={chartData} options={options} />;
//       case 'line':
//         return <Line data={chartData} options={options} />;
//       case 'pie':
//         return <Pie data={chartData} options={options} />;
//       default:
//         return <Bar data={chartData} options={options} />;
//     }
//   };

//   const getColumnOptions = () => {
//     if (!data || data.length === 0) return [];
//     return Object.keys(data[0]);
//   };

//   return (
//     <div className="container">
//       <h1>Excel Data Visualizer</h1>

//       <div className="upload-section">
//         <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
//         <button onClick={handleUpload} disabled={loading}>
//           {loading ? 'Uploading...' : 'Upload & Process'}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}

//       {data && (
//         <div className="chart-controls">
//           <div>
//             <label>Chart Type:</label>
//             <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//               <option value="pie">Pie Chart</option>
//             </select>
//           </div>

//           <div>
//             <label>X-Axis:</label>
//             <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
//               <option value="">Select column</option>
//               {getColumnOptions().map((col) => (
//                 <option key={col} value={col}>
//                   {col}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Y-Axis:</label>
//             <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
//               <option value="">Select column</option>
//               {getColumnOptions().map((col) => (
//                 <option key={col} value={col}>
//                   {col}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       )}

//       <div className="chart-container">
//         {renderChart()}
//       </div>

//       <style jsx>{`
//         .container {
//           max-width: 700px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .upload-section {
//           margin: 20px 0;
//           display: flex;
//           gap: 10px;
//         }
//         .chart-controls {
//           display: flex;
//           gap: 20px;
//           margin: 20px 0;
//         }
//         .chart-controls div {
//           display: flex;
//           flex-direction: column;
//         }
//         .chart-container {
//           margin-top: 30px;
//           height: 500px;
//         }
//         .error {
//           color: red;
//           margin: 10px 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home


import React, { useState,useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';
import Image from "./assessts/background.jpg"
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

const Home = ({ onFileChange }) => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    const renderChart = () => {
        if (!data || !xAxis || !yAxis) return null;

        const labels = data.map(item => item[xAxis]);
        const values = data.map(item => item[yAxis]);

        const chartData = {
            labels,
            datasets: [
                {
                    label: yAxis,
                    data: values,
                    backgroundColor:
                        chartType === 'bar'
                            ? 'rgba(54, 162, 235, 0.5)'
                            : chartType === 'pie'
                                ? [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)',
                                ]
                                : 'rgba(75, 192, 192, 0.5)',
                    borderColor:
                        chartType === 'bar'
                            ? 'rgba(54, 162, 235, 1)'
                            : chartType === 'pie'
                                ? [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                ]
                                : 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text:  `${yAxis} by ${xAxis}`,
          font: {
            size: 20,
            weight: 'bold',
        }
        },
      },
      maintainAspectRatio: false,
    };
        

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };
const fileInputRef = useRef(null);
  const getColumnOptions = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    

    
    <div className="max-w-8xl mx-auto p-6 sm:p-10 bg-white rounded-lg shadow-lg my-10 m" >
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Excel Data Visualizer
      </h1>

      {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-primary w-full sm:w-auto"
          
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn btn-primary px-8 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload & Process'}
        </button>
      </div> */}

    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 px-4 sm:px-0" >
      <label
        htmlFor="file-upload"
        className="
          cursor-pointer
          w-full sm:w-auto
          px-6 py-3
          border-2 border-dashed border-purple-600
          rounded-lg
          text-purple-700
          font-semibold
          text-center
          transition
          transform
          hover:border-purple-800
          hover:text-purple-900
          focus:outline-none
          focus:ring-4 focus:ring-purple-300
          active:scale-95
          select-none
          "
      >
        Select Excel File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          bg-purple-600
          text-white
          font-bold
          rounded-md
          px-8 py-3
          flex items-center justify-center
          gap-2
          transition
          hover:bg-purple-700
          disabled:bg-purple-400
          disabled:cursor-not-allowed
          focus:outline-none focus:ring-4 focus:ring-purple-300
          active:scale-95
          select-none
        "
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {loading ? 'Uploading...' : 'Upload & Process'}
      </button>
    </div>


      

      {error && (
        <div className="text-center text-red-600 font-semibold mb-4">{error}</div>
      )}

      {data && (
        <div className="flex flex-wrap gap-6 justify-center mb-6">
          <div className="flex flex-col">
            <label htmlFor="chartType" className="mb-2 font-semibold text-gray-700">
              Chart Type
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="xAxis" className="mb-2 font-semibold text-gray-700">
              X-Axis
            </label>
            <select
              id="xAxis"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select column</option>
              {getColumnOptions().map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="yAxis" className="mb-2 font-semibold text-gray-700">
              Y-Axis
            </label>
            <select
              id="yAxis"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select column</option>
              {getColumnOptions().map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="relative h-96">{renderChart()}</div>
    </div>
    
  );
};

export default Home;


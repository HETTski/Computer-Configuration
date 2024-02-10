import React, { useEffect, useState } from 'react';
import Header from "../components/header";
import processorImage from "../imgs/processor.png";  

export default function Processor(){
    const [backendData, setBackendData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch('/api')
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data from server:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
                <Header/>
      {loading ? (
        // Loading message while waiting for data
        <p>Loading...</p>
      ) : (
        // Render the data received from the server
        <div className='Informations, Processor'>
          <h1>Processor Configuration</h1>
         
          <p>CPU Model: {backendData.deviceConfig.cpuModel}</p>
          <p>CPU vendor: {backendData.deviceConfig.cpuVendor}</p>
           <p>CPU speed min: {backendData.deviceConfig.cpuSpeedMin} GHz</p>
            <p>CPU speed max: {backendData.deviceConfig.cpuSpeedMax} GHz</p>
          <p>CPU cores: {backendData.deviceConfig.cpuCores}</p>
          <p>CPU socket: {backendData.deviceConfig.cpuSocket}</p>  
        </div>
      )}
    </div>
  );

}

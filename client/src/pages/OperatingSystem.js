import React, { useEffect, useState } from 'react';
import Header from "../components/header";

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
        <div className='Informations, OperatingSystem'>
          <h1>Operating System</h1>
          <p>OS Type: {backendData.deviceConfig.osType}</p>
            <p>OS Platform: {backendData.deviceConfig.osPlatform}</p>
            <p>OS Release: {backendData.deviceConfig.osRelease}</p>
            <p>OS Kernel: {backendData.deviceConfig.osKernel}</p>  
        </div>
      )}
    </div>
  );

}

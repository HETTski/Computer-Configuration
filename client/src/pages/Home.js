import React, { useEffect, useState } from 'react';
import Header from "../components/header";


export default function Home(){
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
        <div className='Informations, Configuration'>
          <h1>Device Configuration</h1>
          <p>CPU Model: {backendData.deviceConfig.cpuModel}</p>
          <p>GPU: {backendData.deviceConfig.graphicsModel}</p>
          <p>OS Type: {backendData.deviceConfig.osType}</p>
          <p>OS Platform: {backendData.deviceConfig.osPlatform}</p>
          <p>Total disk space: {backendData.deviceConfig.diskSize}</p>
          <p>disk type: {backendData.deviceConfig.diskType}</p>
          <p>disk Name: {backendData.deviceConfig.diskName}</p>
          <p>Free Memory: {backendData.deviceConfig.freeMemory}</p>
          <p>Total Memory: {backendData.deviceConfig.totalMemory}</p>
        </div>
      )}
    </div>
  );

}

import React, { useEffect, useState } from 'react';
import Header from "../components/header";

export default function Software() {
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
      <Header />
      {loading ? (
        // Loading message while waiting for data
        <p>Loading...</p>
      ) : (
        // Render the data received from the server
        <div className='Informations, Software'>
          <h1>Technologies and their versions</h1>
          <p>Node Version: {backendData.deviceConfig.nodeVersion}</p>
          <p>Mongoose Version: {backendData.deviceConfig.mongooseVersion}</p>
          <p>React Version: {React.version}</p>

         
          <div>
            <p>Installed Apps:</p>
            <ul>
              {backendData.deviceConfig.installedApps.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

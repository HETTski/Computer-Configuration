const { exec } = require('child_process');
const express = require('express');
const si = require('systeminformation');
const mongoose = require('mongoose');
const http = require('http'); // Add this line to import the http module
const fs = require('fs'); // Add this line to import the fs module

const app = express();

mongoose.connect('mongodb://localhost:27017/devices', { useNewUrlParser: true, useUnifiedTopology: true });

const deviceSchema = new mongoose.Schema({
  cpuModel: String,
  cpuVendor: String,
  cpuSpeedMax: Number,
  cpuSpeedMin: Number,
  cpuSocket: String,
  cpuCores: Number,
  osType: String,
  osPlatform: String,
  osRelease: String,
  osCodeName: String,
  osKernel: String,
  osLogo: String,
  nodeVersion: String,
  mongooseVersion: String,
  totalMemory: Number, 
  freeMemory: Number, 
  graphicsController: String, 
  graphicsVendor: String, 
  graphicsModel: String, 
  diskSize: Number, 
  diskType: String, 
  diskName: String, 
  installedApps: [String],
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);

mongoose.connection.once('open', () => {
  console.log('Connected to database');
}).on('error', (error) => {
  console.log('Connection error:', error);
});

global.InstalledApps = [];


// Function to fetch and save device information to the database
const saveDeviceInformation = async () => {
  try {
    const cpuInfo = await si.cpu();
    const osInfo = await si.osInfo();
    const memInfo = await si.mem();
    const graphicsInfo = await si.graphics();
    const diskInfo = await si.diskLayout();
    
    const installedAppsData = fs.readFileSync('installedAppsData.json', 'utf8');
    global.InstalledApps = JSON.parse(installedAppsData).installedApps;
  
    
      const deviceConfig = {
        cpuModel: cpuInfo.manufacturer + ' ' + cpuInfo.brand,
        cpuVendor: cpuInfo.vendor,
        cpuSpeedMin: cpuInfo.speedMin,
        cpuSpeedMax: cpuInfo.speedMax,
        cpuCores: cpuInfo.cores,
        cpuSocket: cpuInfo.socket,
        osType: osInfo.distro,
        osPlatform: osInfo.platform,
        osRelease: osInfo.release,
        osCodeName: osInfo.codename,
        osKernel: osInfo.kernel,
        osLogo: osInfo.logofile,
        nodeVersion: process.version,
        mongooseVersion: mongoose.version,
        totalMemory: (memInfo.total / (1024 * 1024 * 1024)).toFixed(2), // to GB
        freeMemory: (memInfo.free / (1024 * 1024 * 1024)).toFixed(2), // to GB
        graphicsController: graphicsInfo.controllers[0].controller,
        graphicsVendor: graphicsInfo.controllers[0].vendor,
        graphicsModel: graphicsInfo.controllers[0].model,
        diskSize: (diskInfo[0].size / (1024 * 1024 * 1024)).toFixed(2), // to GB
        diskType: diskInfo[0].type,
        diskName: diskInfo[0].name,
        installedApps: global.InstalledApps,
      };
      const existingDevice = await Device.findOne({
        cpuModel: deviceConfig.cpuModel,
        cpuVendor: deviceConfig.cpuVendor,
      });

      if (existingDevice) {
        // Update the existing document with the new device information
        existingDevice.set(deviceConfig);
        await existingDevice.save();
        console.log('Device information updated in the database');
      } else {
        // Create a new document if no existing document is found
        const newDevice = new Device(deviceConfig);
        await newDevice.save();
        console.log('Device information saved to the database');
      }

  } catch (error) {
    console.error('Error fetching or saving device information:', error);
  }
};

// Initial save of device information and then save every 2 minutes
saveDeviceInformation();
setInterval(saveDeviceInformation, 2 * 1000);


app.get('/api', async (req, res) => {
  try {
    // Fetch device information from the database
    const devices = await Device.find().sort({ _id: -1 }).limit(1);
    const latestDevice = devices[0];

    
    const cpuUsage = await si.currentLoad();

    // Sending device configuration, memory, graphics, and CPU usage data as JSON response to the React client
    res.json({ deviceConfig: latestDevice, cpuUsage });
  } catch (error) {
    console.error('Error fetching device information or CPU usage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const server = http.createServer(app);

const restartServer = () => {
  console.log('Restarting server...');

  // Start a new server instance
  const childProcess = require('child_process');
  const newServer = childProcess.spawn(process.argv[0], process.argv.slice(1), {
    cwd: process.cwd(),
    detached: true,
    stdio: 'inherit',
  });

  newServer.unref();

};

setInterval(restartServer, 15 * 1000);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

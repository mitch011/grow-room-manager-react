import React, { useState, useEffect } from 'react';
import RoomSelector from './components/RoomSelector';
import ControlPanel from './components/ControlPanel';
import Layout from './components/Layout';
import StrainManager from './components/StrainManager';
import Tabs from './components/Tabs';
import StrainUsageTab from './components/StrainUsageTab';
import PlantToolsTab from './components/PlantToolsTab';
import KilledPlantsTab from './components/KilledPlantsTab';
import MovedPlantsTab from './components/MovedPlantsTab';
import GrowthPhaseTab from './components/GrowthPhaseTab';
import SensorTab from './components/SensorTab';
import TasksTab from './components/TasksTab';
import ComplianceTab from './components/ComplianceTab';
import StorageService from './services/StorageService';

function App() {
  const [co2Input, setCo2Input] = useState('');
  const [rooms, setRooms] = useState({});
  const [currentRoom, setCurrentRoom] = useState('');
  const [tables, setTables] = useState(5);
  const [lightsPerTable, setLightsPerTable] = useState(4);
  const [plantsPerLight, setPlantsPerLight] = useState(15);
  const [strainInput, setStrainInput] = useState('');
  const [strainUsage, setStrainUsage] = useState({});
  const [strainAssignments, setStrainAssignments] = useState({});
  const [killedPlants, setKilledPlants] = useState([]);
  const [movedPlants, setMovedPlants] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('veg');
  const [phaseStartDate, setPhaseStartDate] = useState('');
  const [sensorData, setSensorData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [plantCountThreshold, setPlantCountThreshold] = useState(0);
  const [auditLog, setAuditLog] = useState([]);
  const [tempInput, setTempInput] = useState('');
  const [humidityInput, setHumidityInput] = useState('');

  // Load rooms on first load
  useEffect(() => {
    const loadedRooms = StorageService.loadRooms();
    const lastRoom = StorageService.loadLastActiveRoom();
    setRooms(loadedRooms);
    if (lastRoom && loadedRooms[lastRoom]) {
      loadRoomData(lastRoom, loadedRooms[lastRoom]);
    } else if (Object.keys(loadedRooms).length > 0) {
      const firstRoom = Object.keys(loadedRooms)[0];
      loadRoomData(firstRoom, loadedRooms[firstRoom]);
    }
  }, []);

  useEffect(() => {
    if (currentRoom) {
      saveCurrentRoom();
    }
  }, [rooms, currentRoom]);

  const saveCurrentRoom = () => {
    StorageService.saveRoomData(currentRoom, {
      tables,
      lightsPerTable,
      plantsPerLight,
      strainInput,
      strainUsage,
      strainAssignments,
      killedPlants,
      movedPlants,
      currentPhase,
      phaseStartDate,
      sensorData,
      tasks,
      plantCountThreshold,
      auditLog
    });
  };
  const handleRecordSensorData = () => {
  const temp = parseFloat(tempInput);
  const humidity = parseFloat(humidityInput);
  const co2 = parseInt(co2Input, 10);

  if (isNaN(temp) || isNaN(humidity) || isNaN(co2)) {
    alert("Please enter valid temperature, humidity, and CO₂ values.");
    return;
  }

  const vpd = calculateVPD(temp, humidity);

  setSensorData(prev => [
    ...prev,
    { temp, humidity, co2, vpd, timestamp: new Date().toISOString() }
  ]);

  // Clear inputs if you want
  setTempInput('');
  setHumidityInput('');
  setCo2Input('');
};

const calculateVPD = (tempF, humidity) => {
  const tempC = (tempF - 32) * 5/9;
  const saturationVaporPressure = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const actualVaporPressure = saturationVaporPressure * (humidity / 100);
  const vpdKpa = saturationVaporPressure - actualVaporPressure;
  return vpdKpa;
};


  const loadRoomData = (roomName, data) => {
    setCurrentRoom(roomName);
    setTables(data.tables || 5);
    setLightsPerTable(data.lightsPerTable || 4);
    setPlantsPerLight(data.plantsPerLight || 15);
    setStrainInput(data.strainInput || '');
    setStrainUsage(data.strainUsage || {});
    setStrainAssignments(data.strainAssignments || {});
    setKilledPlants(data.killedPlants || []);
    setMovedPlants(data.movedPlants || []);
    setCurrentPhase(data.currentPhase || 'veg');
    setPhaseStartDate(data.phaseStartDate || '');
    setSensorData(data.sensorData || []);
    setTasks(data.tasks || []);
    setPlantCountThreshold(data.plantCountThreshold || 0);
    setAuditLog(data.auditLog || []);
  };

  // Room Management
  const handleSelectRoom = (roomName) => {
    if (rooms[roomName]) {
      loadRoomData(roomName, rooms[roomName]);
    }
  };

  const handleAddRoom = (roomName) => {
    const newRooms = {
      ...rooms,
      [roomName]: {
        tables: 5,
        lightsPerTable: 4,
        plantsPerLight: 15,
        strainInput: '',
        strainUsage: {},
        strainAssignments: {},
        killedPlants: [],
        movedPlants: [],
        currentPhase: 'veg',
        phaseStartDate: new Date().toISOString().split('T')[0],
        sensorData: [],
        tasks: [],
        plantCountThreshold: 0,
        auditLog: []
      }
    };
    setRooms(newRooms);
    loadRoomData(roomName, newRooms[roomName]);
  };

  const handleRemoveRoom = (roomName) => {
    const newCurrent = StorageService.deleteRoom(roomName);
    const updatedRooms = StorageService.loadRooms();
    setRooms(updatedRooms);
    if (newCurrent) {
      loadRoomData(newCurrent, updatedRooms[newCurrent]);
    } else {
      setCurrentRoom('');
    }
  };

  // Layout
  const handleGenerateLayout = () => {
    const newAssignments = {};
    for (let table = 0; table < tables; table++) {
      for (let light = 0; light < lightsPerTable; light++) {
        newAssignments[`${table}-${light}`] = {};
      }
    }
    setStrainAssignments(newAssignments);
    setStrainUsage({});
  };

  // Strain Management
  const handleDistributeStrains = () => {
    const lines = strainInput.split('\n').filter(Boolean);
    let assignments = {};
    let usage = {};

    let strains = [];
    lines.forEach((line) => {
      const [name, count] = line.split(':').map((x) => x.trim());
      strains.push({ name, count: parseInt(count, 10) });
    });

    let allLights = [];
    for (let table = 0; table < tables; table++) {
      for (let light = 0; light < lightsPerTable; light++) {
        allLights.push(`${table}-${light}`);
      }
    }

    let currentLight = 0;
    strains.forEach((strain) => {
      let assigned = 0;
      while (assigned < strain.count && currentLight < allLights.length) {
        assignments[allLights[currentLight]] = { strainName: strain.name };
        assigned += plantsPerLight;
        currentLight++;
      }
      usage[strain.name] = (usage[strain.name] || 0) + assigned;
    });

    setStrainAssignments(assignments);
    setStrainUsage(usage);
  };

  const handleResetStrainData = () => {
    setStrainAssignments({});
    setStrainUsage({});
    setStrainInput('');
  };

  const handleExportStrainUsage = () => {
    const csv = "Strain Name,Plants Assigned\n" +
      Object.entries(strainUsage).map(([name, count]) => `${name},${count}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `strain-usage-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tasks
  const handleAddTask = (text) => {
    setTasks(prev => [...prev, { text, completed: false }]);
  };

  const handleToggleTaskComplete = (index) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[index].completed = !updated[index].completed;
      return updated;
    });
  };

  const handleDeleteTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <h2>Grow Room Manager (React)</h2>

      <RoomSelector
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={handleSelectRoom}
        onAddRoom={handleAddRoom}
        onRemoveRoom={handleRemoveRoom}
      />

      <ControlPanel
        tables={tables}
        lightsPerTable={lightsPerTable}
        plantsPerLight={plantsPerLight}
        onTablesChange={setTables}
        onLightsPerTableChange={setLightsPerTable}
        onPlantsPerLightChange={setPlantsPerLight}
        onGenerateLayout={handleGenerateLayout}
      />

      <StrainManager
        strainInput={strainInput}
        onStrainInputChange={setStrainInput}
        onDistributeStrains={handleDistributeStrains}
        onResetStrainData={handleResetStrainData}
        onExportStrainUsage={handleExportStrainUsage}
      />

      <Layout
        tables={tables}
        lightsPerTable={lightsPerTable}
        strainAssignments={strainAssignments}
        onLightClick={(table, light) => {}}
      />

      <Tabs
        tabs={[
          { key: 'strainUsageTab', label: 'Strain Usage', content: <StrainUsageTab strainUsage={strainUsage} /> },
          { key: 'plantToolsTab', label: 'Plant Tools', content: <PlantToolsTab /> },
          { key: 'killedPlantsTab', label: 'Killed Plants', content: <KilledPlantsTab killedPlants={killedPlants} onResetKilledPlants={() => setKilledPlants([])} /> },
          { key: 'movedPlantsTab', label: 'Moved Plants', content: <MovedPlantsTab movedPlants={movedPlants} onResetMovedPlants={() => setMovedPlants([])} /> },
          { key: 'growthPhaseTab', label: 'Growth Phase', content: <GrowthPhaseTab currentPhase={currentPhase} phaseStartDate={phaseStartDate} onPhaseChange={setCurrentPhase} onPhaseDateChange={setPhaseStartDate} /> },
          { key: 'sensorTab', label: 'Sensors', content: <SensorTab tempInput={tempInput} humidityInput={humidityInput} onTempChange={setTempInput} onHumidityChange={setHumidityInput} onRecordSensorData={() => {}} sensorData={sensorData} /> },
          { key: 'tasksTab', label: 'Tasks', content: <TasksTab tasks={tasks} onAddTask={handleAddTask} onToggleTaskComplete={handleToggleTaskComplete} onDeleteTask={handleDeleteTask} /> },
          { key: 'complianceTab', label: 'Compliance', content: <ComplianceTab plantCountThreshold={plantCountThreshold} auditLog={auditLog} onSetThreshold={setPlantCountThreshold} onGenerateReport={() => {}} onExportComplianceData={() => {}} onExportAllData={() => {}} /> }
        ]}
      />
    </div>
  );
}

export default App;

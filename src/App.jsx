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
import ManualIDAssignment from './components/ManualIDAssignment';
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

  // Example available IDs per strain
  const [availableIDsByStrain] = useState({
    StrainA: 300,
    StrainB: 250,
    StrainC: 200,
  });

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

  // Callback for manual ID assignment
  const handleAssignIDs = (tableIdx, lightIdx, plantIds) => {
    setStrainAssignments(prev => ({
      ...prev,
      [`${tableIdx}-${lightIdx}`]: {
        ...prev[`${tableIdx}-${lightIdx}`],
        plantIds
      }
    }));
  };

  // Callback when user loads strain-level IDs
  const handleLoadStrainIDs = (strain, ids) => {
    console.log(`Loaded ${ids.length} IDs for ${strain}`);
    // You can further distribute these IDs in strainAssignments if needed
  };

  return (
    <div className="App">
      <h2>Grow Room Manager (React)</h2>

      <RoomSelector
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={loadRoomData}
        onAddRoom={roomName => {
          const newRooms = { ...rooms };
          newRooms[roomName] = {};
          setRooms(newRooms);
          loadRoomData(roomName, newRooms[roomName]);
        }}
        onRemoveRoom={StorageService.deleteRoom}
      />

      <ControlPanel
        tables={tables}
        lightsPerTable={lightsPerTable}
        plantsPerLight={plantsPerLight}
        onTablesChange={setTables}
        onLightsPerTableChange={setLightsPerTable}
        onPlantsPerLightChange={setPlantsPerLight}
      />

      <StrainManager
        strainInput={strainInput}
        onStrainInputChange={setStrainInput}
        onDistributeStrains={() => {}}
        onResetStrainData={() => {}}
        onExportStrainUsage={() => {}}
      />

      <Layout
        tables={tables}
        lightsPerTable={lightsPerTable}
        strainAssignments={strainAssignments}
        onLightClick={() => {}}
      />

      <ManualIDAssignment
        tables={tables}
        lightsPerTable={Array.isArray(lightsPerTable)
          ? lightsPerTable
          : Array(tables).fill(lightsPerTable)}
        plantsPerLight={plantsPerLight}
        strainAssignments={strainAssignments}
        availableIDsByStrain={availableIDsByStrain}
        onAssign={handleAssignIDs}
        onLoadStrainIDs={handleLoadStrainIDs}
      />

      <Tabs
        tabs={[
          { key: 'strainUsageTab', label: 'Strain Usage', content: <StrainUsageTab strainUsage={strainUsage} /> },
          { key: 'plantToolsTab', label: 'Plant Tools', content: <PlantToolsTab /> },
          { key: 'killedPlantsTab', label: 'Killed Plants', content: <KilledPlantsTab killedPlants={killedPlants} onResetKilledPlants={() => setKilledPlants([])} /> },
          { key: 'movedPlantsTab', label: 'Moved Plants', content: <MovedPlantsTab movedPlants={movedPlants} onResetMovedPlants={() => setMovedPlants([])} /> },
          { key: 'growthPhaseTab', label: 'Growth Phase', content: <GrowthPhaseTab currentPhase={currentPhase} phaseStartDate={phaseStartDate} onPhaseChange={setCurrentPhase} onPhaseDateChange={setPhaseStartDate} /> },
          { key: 'sensorTab', label: 'Sensors', content: <SensorTab tempInput={tempInput} humidityInput={setHumidityInput} onTempChange={setTempInput} onHumidityChange={setHumidityInput} onRecordSensorData={() => {}} sensorData={sensorData} /> },
          { key: 'tasksTab', label: 'Tasks', content: <TasksTab tasks={tasks} onAddTask={() => {}} onToggleTaskComplete={() => {}} onDeleteTask={() => {}} /> },
          { key: 'complianceTab', label: 'Compliance', content: <ComplianceTab plantCountThreshold={plantCountThreshold} auditLog={auditLog} onSetThreshold={setPlantCountThreshold} onGenerateReport={() => {}} onExportComplianceData={() => {}} onExportAllData={() => {}} /> }
        ]}
      />
    </div>
  );
}

export default App;

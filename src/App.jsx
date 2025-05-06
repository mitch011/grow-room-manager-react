import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import Tabs from './components/Tabs';
import Layout from './components/Layout';
import StrainManager from './components/StrainManager';
import StrainUsageTab from './components/StrainUsageTab';
import SensorTab from './components/SensorTab';
import PlantToolsTab from './components/PlantToolsTab';
import ComplianceTab from './components/ComplianceTab';
import PestPressureManager from './components/PestPressureManager';
import Modal from './components/Modal';
import StorageService from './services/StorageService';
import { toast } from 'react-hot-toast';

function App() {
  // ─── STATE ────────────────────────────────────────────────────
  const [rooms, setRooms] = useState({});
  const [currentRoom, setCurrentRoom] = useState('');
  const [tables, setTables] = useState(5);
  const [lightsPerTable, setLightsPerTable] = useState({});
  const [plantsPerLight, setPlantsPerLight] = useState(15);
  const [strainInput, setStrainInput] = useState('');
  const [strainAssignments, setStrainAssignments] = useState({});
  const [strainColors, setStrainColors] = useState({});
  const [sensorData, setSensorData] = useState([]);
  const [killedPlants, setKilledPlants] = useState([]);
  const [movedPlants, setMovedPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [tempInput, setTempInput] = useState('');
  const [humidityInput, setHumidityInput] = useState('');
  const [co2Input, setCo2Input] = useState('');

  const [growthPhase, setGrowthPhase] = useState('veg');
  const [plantEntryDates, setPlantEntryDates] = useState({});

  const [lightModalOpen, setLightModalOpen] = useState(false);
  const [modalTable, setModalTable] = useState(0);
  const [modalLight, setModalLight] = useState(0);

  // ─── LOAD / SAVE ───────────────────────────────────────────────
  useEffect(() => {
    const loaded = StorageService.loadRooms();
    const last = StorageService.loadLastActiveRoom();
    setRooms(loaded);

    if (last && loaded[last]) {
      loadRoomData(last, loaded[last]);
    } else if (Object.keys(loaded).length) {
      const first = Object.keys(loaded)[0];
      loadRoomData(first, loaded[first]);
    }
  }, []);

  useEffect(() => {
    if (currentRoom) saveCurrentRoom();
  }, [
    rooms, currentRoom,
    tables, lightsPerTable, plantsPerLight,
    strainInput, strainAssignments, strainColors,
    sensorData, killedPlants, movedPlants, tasks, auditLog,
    growthPhase, plantEntryDates
  ]);

  const saveCurrentRoom = () => {
    StorageService.saveRoomData(currentRoom, {
      tables,
      lightsPerTable,
      plantsPerLight,
      strainInput,
      strainAssignments,
      strainColors,
      sensorData,
      killedPlants,
      movedPlants,
      tasks,
      auditLog,
      growthPhase,
      plantEntryDates
    });
  };

  const loadRoomData = (name, data) => {
    setCurrentRoom(name);
    setTables(data.tables ?? 5);
    setLightsPerTable(data.lightsPerTable ?? {});
    setPlantsPerLight(data.plantsPerLight ?? 15);
    setStrainInput(data.strainInput ?? '');
    setStrainAssignments(data.strainAssignments ?? {});
    setStrainColors(data.strainColors ?? {});
    setSensorData(data.sensorData ?? []);
    setKilledPlants(data.killedPlants ?? []);
    setMovedPlants(data.movedPlants ?? []);
    setTasks(data.tasks ?? []);
    setAuditLog(data.auditLog ?? []);
    setGrowthPhase(data.growthPhase ?? 'veg');
    setPlantEntryDates(data.plantEntryDates ?? {});
  };

  // ─── HELPERS ───────────────────────────────────────────────────
  const calculateDays = entryDate => {
    if (!entryDate) return 0;
    const diff = Math.abs(new Date() - new Date(entryDate));
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // ─── HANDLERS ──────────────────────────────────────────────────
  const handleTablesChange = n => setTables(n);
  const handleLightsPerTableChange = obj => setLightsPerTable(obj);
  const handlePlantsPerLightChange = n => setPlantsPerLight(n);

  const handleSelectRoom = name => {
    if (rooms[name]) loadRoomData(name, rooms[name]);
  };

  const handleAddRoom = name => {
    if (!name.trim()) return toast.error('Room name required');
    if (rooms[name]) return toast.error('That room already exists');
    const newRooms = { ...rooms, [name]: { tables, lightsPerTable, plantsPerLight, strainInput: '', strainAssignments: {}, strainColors: {}, sensorData: [], killedPlants: [], movedPlants: [], tasks: [], auditLog: [], growthPhase: 'veg', plantEntryDates: {} } };
    setRooms(newRooms);
    setCurrentRoom(name);
    toast.success(`Room "${name}" created`);
  };

  const handleDeleteRoom = name => {
    if (!window.confirm(`Delete \"${name}\"? This cannot be undone.`)) return;
    const nxt = { ...rooms };
    delete nxt[name];
    setRooms(nxt);
    const remaining = Object.keys(nxt);
    setCurrentRoom(remaining[0] || '');
    toast.success(`Room "${name}" deleted`);
  };

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="App" style={{ padding: 20 }}>
      <ControlPanel
        tables={tables}
        lightsPerTable={lightsPerTable}
        plantsPerLight={plantsPerLight}
        rooms={rooms}
        currentRoom={currentRoom}
        onTablesChange={handleTablesChange}
        onLightsPerTableChange={handleLightsPerTableChange}
        onPlantsPerLightChange={handlePlantsPerLightChange}
        onSelectRoom={handleSelectRoom}
        onAddRoom={handleAddRoom}
        onDeleteRoom={handleDeleteRoom}
      />

      <Tabs
        tabs={[
          {
            label: 'Layout',
            content: (
              <>
                <StrainManager
                  strainInput={strainInput}
                  onStrainInputChange={setStrainInput}
                  onDistributeStrains={() => { /* ... */ }}
                />
                <Layout
                  tables={tables}
                  lightsPerTable={lightsPerTable}
                  plantsPerLight={plantsPerLight}
                  strainAssignments={strainAssignments}
                  strainColors={strainColors}
                  onLightClick={() => { /* ... */ }}
                  onFlipTable={() => { /* ... */ }}
                />
              </>
            )
          },
          {
            label: 'Strain Usage',
            content: (
              <StrainUsageTab
                strainAssignments={strainAssignments}
                plantsPerLight={plantsPerLight}
                tables={tables}
                lightsPerTable={lightsPerTable}
                strainColors={strainColors}
              />
            )
          },
          {
            label: 'Ambient',
            content: (
              <SensorTab
                sensorData={sensorData}
                tempInput={tempInput}
                humidityInput={humidityInput}
                co2Input={co2Input}
                setTempInput={setTempInput}
                setHumidityInput={setHumidityInput}
                setCo2Input={setCo2Input}
                onSensorSave={() => { /* ... */ }}
              />
            )
          },
          {
            label: 'Pest Pressure',
            content: (
              <PestPressureManager
                currentRoom={currentRoom}
                tables={tables}
                lightsPerTable={lightsPerTable}
                plantsPerLight={plantsPerLight}
              />
            )
          },
          {
            label: 'Plant Tools',
            content: (
              <PlantToolsTab
                strainAssignments={strainAssignments}
                plantsPerLight={plantsPerLight}
                killedPlants={killedPlants}
                movedPlants={movedPlants}
                plantEntryDates={plantEntryDates}
                growthPhase={growthPhase}
                calculateDays={calculateDays}
                onKillPlant={() => { /* ... */ }}
                onMovePlant={() => { /* ... */ }}
              />
            )
          },
          {
            label: 'Compliance',
            content: (
              <ComplianceTab tasks={tasks} auditLog={auditLog} />
            )
          }
        ]}
      />

      <Modal isOpen={lightModalOpen} onClose={() => setLightModalOpen(false)}>
        {/* ... existing modal content ... */}
      </Modal>
    </div>
  );
}

export default App;

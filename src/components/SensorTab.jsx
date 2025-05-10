import React from 'react';
import ChartComponent from './ChartComponent';

const SensorTab = ({
  tempInput,
  humidityInput,
  co2Input,
  onTempChange,
  onHumidityChange,
  onCo2Change,
  onRecordSensorData,
  sensorData
}) => {
  const latestTemp = sensorData.length > 0 ? sensorData[sensorData.length - 1].temp : '--';
  const latestHumidity = sensorData.length > 0 ? sensorData[sensorData.length - 1].humidity : '--';
  const latestCo2 = sensorData.length > 0 ? sensorData[sensorData.length - 1].co2 : '--';
  const latestVpd = sensorData.length > 0 && sensorData[sensorData.length - 1].vpd != null
    ? sensorData[sensorData.length - 1].vpd.toFixed(2)
    : '--';

  const chartData = {
    labels: sensorData.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: sensorData.map(entry => entry.temp),
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: sensorData.map(entry => entry.humidity),
        yAxisID: 'y1',
      },
      {
        label: 'CO₂ (ppm)',
        data: sensorData.map(entry => entry.co2),
        yAxisID: 'y2',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { type: 'linear', position: 'left', title: { display: true, text: 'Temp (°F)' } },
      y1: {
        type: 'linear', position: 'right', title: { display: true, text: 'Humidity (%)' },
        grid: { drawOnChartArea: false }
      },
      y2: {
        type: 'linear', position: 'right', title: { display: true, text: 'CO₂ (ppm)' },
        grid: { drawOnChartArea: false }, offset: true
      }
    },
  };

  return (
    <div className="sensor-tab">
      <h3>Sensor Data</h3>

      <div className="control-group">
        <label>Temperature (°F):</label>
        <input type="number" step="0.1" value={tempInput} onChange={e => onTempChange(e.target.value)} />

        <label>Humidity (%):</label>
        <input type="number" step="0.1" value={humidityInput} onChange={e => onHumidityChange(e.target.value)} />

        <label>CO₂ (ppm):</label>
        <input type="number" step="1" value={co2Input} onChange={e => onCo2Change(e.target.value)} />

        <button onClick={onRecordSensorData}>Record Data</button>
      </div>

      <div className="sensor-display" style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div className="sensor-card">
          <div className="sensor-label">Current Temp</div>
          <div className="sensor-value">{latestTemp}</div>
        </div>
        <div className="sensor-card">
          <div className="sensor-label">Current Humidity</div>
          <div className="sensor-value">{latestHumidity}</div>
        </div>
        <div className="sensor-card">
          <div className="sensor-label">Current CO₂</div>
          <div className="sensor-value">{latestCo2}</div>
        </div>
        <div className="sensor-card">
          <div className="sensor-label">VPD</div>
          <div className="sensor-value">{latestVpd}</div>
        </div>
      </div>

      <div style={{ marginTop: 30, height: 300 }}>
        <ChartComponent data={chartData} options={chartOptions} type="line" />
      </div>
    </div>
  );
};

export default SensorTab;

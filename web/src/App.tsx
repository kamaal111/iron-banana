import React from 'react';

import './App.css';

type RealSerialPort = SerialPort & { connected: boolean };

const App = () => {
  const [connectedPort, setConnectedPort] =
    React.useState<RealSerialPort | null>(null);

  async function handleClick() {
    const port = (await navigator.serial.requestPort()) as RealSerialPort;
    await port.open({ baudRate: 115200 });

    setConnectedPort(port);
  }

  async function getPaired() {
    const ports = await navigator.serial.getPorts();
    const connectedPort =
      (ports as Array<RealSerialPort>).find((port) => port.connected) ?? null;

    setConnectedPort(connectedPort);
  }

  React.useEffect(() => {
    getPaired();
  }, []);

  return (
    <div className="content">
      {connectedPort == null ? (
        <button type="button" onClick={handleClick}>
          Connect to banana
        </button>
      ) : (
        <h1>Connected</h1>
      )}
    </div>
  );
};

export default App;

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

    // const writer = port.writable.getWriter();
    // const encoder = new TextEncoder();

    // const data = encoder.encode(userData);

    // // Send the data to the device.
    // await writer.write(data);
    // writer.releaseLock();
  }

  async function getPaired() {
    const ports = await navigator.serial.getPorts();
    const connectedPort =
      (ports as Array<RealSerialPort>).find((port) => port.connected) ?? null;

    setConnectedPort(connectedPort);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      ) : null}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" minLength={3} />
        <button type="submit">Store</button>
      </form>
    </div>
  );
};

export default App;

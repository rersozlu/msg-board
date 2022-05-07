import { useEffect, useState } from "react";
import { checkIfWalletConnected, connectWallet } from "./utils/walletFuncs";
import { getWaveCount, wave, getAllWaves } from "./utils/contractFuncs";
function App() {
  const [account, setAccount] = useState("");
  const [waveNum, setWaveNum] = useState(0);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    async function checkIfConnected() {
      const userAcc = await checkIfWalletConnected();
      setAccount(userAcc);
      const num = await getWaveCount();
      setWaveNum(num);
      const allMessages = await getAllWaves();
      setAllMessages(allMessages);
    }

    checkIfConnected();
  }, [account, waveNum]);
  const allMessagesArray = allMessages
    .map((msg, index) => {
      return (
        <div className="message" key={index}>
          <h4>MSG NO: {index + 1}</h4>
          <p>
            Sender:{" "}
            {msg.address.slice(0, 3) +
              "..." +
              msg.address.slice(-4, msg.address.length)}
          </p>
          <p>
            Content: <strong>{msg.message}</strong>
          </p>
          <p>Date: {msg.timestamp.toLocaleString()}</p>
        </div>
      );
    })
    .reverse();
  return (
    <>
      <h1 className="warning">
        PAGE IS NOT RESPONSIVE PLEASE USE SOMETHING WITH A BIGGER SCREEN
      </h1>
      <div className="App">
        <nav>
          <h1>MESSAGE BOARD</h1>
          <p>Total Messages: {waveNum}</p>
          <button onClick={async () => setAccount(await connectWallet())}>
            {account ? "Connected" : "ConnectWallet"}
          </button>
        </nav>
        <div className="form">
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="type your message"
          />
          <button
            onClick={async () => {
              setWaveNum(await wave(message));
              setMessage("");
            }}
          >
            Send Message
          </button>
        </div>

        {allMessagesArray}

        <footer>Rinkeby Testnet</footer>
      </div>
    </>
  );
}

export default App;

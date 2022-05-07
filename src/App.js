import { useEffect, useState } from "react";
import { checkIfWalletConnected, connectWallet } from "./utils/walletFuncs";
import { getWaveCount, wave, getAllWaves } from "./utils/contractFuncs";
import { Hashicon } from "@emeraldpay/hashicon-react";
function App() {
  const [account, setAccount] = useState("");
  const [waveNum, setWaveNum] = useState(0);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    try {
      async function checkIfConnected() {
        const chainId = "0x4";
        if (window.ethereum.networkVersion !== chainId) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4" }],
          });
        }
        const userAcc = await checkIfWalletConnected();

        setAccount(userAcc);
        const num = await getWaveCount();
        setWaveNum(num);
        const allMessages = await getAllWaves();
        setAllMessages(allMessages);
      }

      checkIfConnected();
    } catch (e) {
      console.log(e);
    }
  }, [account, waveNum]);
  const allMessagesArray = allMessages
    .map((msg, index) => {
      return (
        <div className="msg-box" key={index}>
          <div className="message">
            <h4>Nº. {index + 1}</h4>
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
          <Hashicon value={msg.address.toUpperCase()} size={40} />
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
          <h1>
            MESSAGE BOARD <span className="italic"> - Rinkeby Testnet</span>
          </h1>
          <p>Total Messages: {waveNum}</p>
          <button onClick={async () => setAccount(await connectWallet())}>
            {account ? "Connected" : "ConnectWallet"}
          </button>
        </nav>
        <div className="form">
          {account && <Hashicon value={account.toUpperCase()} size={35} />}
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="type your message"
          />
          <button
            onClick={async () => {
              if (message && message !== " ") {
                setWaveNum(await wave(message));
                setMessage("");
              } else {
                alert("Please send a valid message!");
              }
            }}
          >
            Send Message
          </button>
        </div>
        {allMessagesArray}
      </div>
    </>
  );
}

export default App;

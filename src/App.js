import { useEffect, useState } from "react";
import { checkIfWalletConnected, connectWallet } from "./utils/walletFuncs";
import { getWaveCount, wave, getAllWaves } from "./utils/contractFuncs";
import { Hashicon } from "@emeraldpay/hashicon-react";
import Loading from "./Loading";
import { VenlyConnect } from "@venly/connect";
function App() {
  const [account, setAccount] = useState("");
  const [waveNum, setWaveNum] = useState(0);
  const [message, setMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [venlyConnect, setVenlyConnect] = useState({});
  const [venlyAcc, setVenlyAcc] = useState({ acc: "", id: "" });

  async function sendWithVenly() {
    const signer = venlyConnect.createSigner();
    signer
      .executeContract({
        secretType: "ETHEREUM",
        walletId: venlyAcc.id,
        to: "0xe41E99D39E84Ec080244E1aA5aB15E1b1d708618",
        value: 0,
        functionName: "wave",
        inputs: [{ type: "string", value: message }],
      })
      .then((resp) => console.log(resp));
  }

  async function connectWithVenly() {
    await venlyConnect.flows.getAccount("ETHEREUM").then((account) => {
      console.log("User name:", account.auth.tokenParsed.name);
      console.log("User email:", account.auth.tokenParsed.email);
      console.log("First wallet address:", account.wallets[0].address);
      console.log("First wallet balance:", account.wallets[0].balance.balance);
      setVenlyAcc({
        acc: account.wallets[0].address,
        id: account.wallets[0].id,
      });
    });
  }
  function disconnect() {
    venlyConnect.logout({ windowMode: "REDIRECT" });
    setVenlyAcc({});
  }
  useEffect(() => {
    try {
      const venly = new VenlyConnect("Testaccount", {
        environment: "staging",
      });
      setVenlyConnect(venly);
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
              try {
                if (message && message !== " ") {
                  setMessageSending(true);
                  if (venlyAcc.acc) {
                    await sendWithVenly();
                  } else {
                    setWaveNum(await wave(message));
                  }
                  setMessage("");
                  setMessageSending(false);
                } else {
                  alert("Please send a valid message!");
                }
              } catch (e) {
                console.log(e);
                setMessageSending(false);
              }
            }}
          >
            Send Message
          </button>
          <button onClick={venlyAcc.acc ? disconnect : connectWithVenly}>
            {venlyAcc.acc ? "Disconnect" : "Connect with Venly"}
          </button>
        </div>
        {messageSending && <Loading />}
        {allMessagesArray}
      </div>
    </>
  );
}

export default App;

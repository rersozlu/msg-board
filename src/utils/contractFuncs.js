import { ethers } from "ethers";
import abi from "./WavePortal.json";

async function getWaveCount() {
  const { ethereum } = window;
  const contractAddress = "0xe41E99D39E84Ec080244E1aA5aB15E1b1d708618";
  const contractABI = abi.abi;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    let count = await wavePortalContract.getTotalWaves();
    return count.toNumber();
  }
}
async function wave(message) {
  const { ethereum } = window;
  const contractAddress = "0xe41E99D39E84Ec080244E1aA5aB15E1b1d708618";
  const contractABI = abi.abi;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  let waveTxn = await wavePortalContract.wave(message);
  await waveTxn.wait();
  return await getWaveCount();
}

async function getAllWaves() {
  const { ethereum } = window;
  const contractAddress = "0xe41E99D39E84Ec080244E1aA5aB15E1b1d708618";
  const contractABI = abi.abi;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  let waveTxn = await wavePortalContract.getAllWaves();
  let wavesCleaned = waveTxn.map((msg) => ({
    address: msg.waver,
    timestamp: new Date(msg.timestamp * 1000),
    message: msg.message,
  }));
  return wavesCleaned;
}

export { getWaveCount, wave, getAllWaves };

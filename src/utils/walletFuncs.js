async function checkIfWalletConnected() {
  const { ethereum } = window;
  if (!ethereum) {
    alert("download metamask!");
  } else {
    console.log("ethereum object found");
  }
  const accounts = await ethereum.request({ method: "eth_accounts" });
  if (accounts.length > 0) {
    console.log(accounts[0]);
    return accounts[0];
  } else {
    console.log("no auth account found");
    return "";
  }
}
async function connectWallet() {
  const { ethereum } = window;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  console.log("connected to: ", accounts[0]);
  return accounts[0];
}
export { checkIfWalletConnected, connectWallet };

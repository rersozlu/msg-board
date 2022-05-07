async function checkIfWalletConnected() {
  const { ethereum } = window;
  if (!ethereum) {
    alert("download metamask!");
  }
  const accounts = await ethereum.request({ method: "eth_accounts" });
  if (accounts.length > 0) {
    return accounts[0];
  } else {
    return "";
  }
}
async function connectWallet() {
  const { ethereum } = window;
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}
export { checkIfWalletConnected, connectWallet };

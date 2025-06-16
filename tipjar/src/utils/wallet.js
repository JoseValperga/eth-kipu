//solo lo utilicé para comprobar inicialmente si MetaMask está instalado y conectado la wallet
//no lo utilicé en el código final

import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask no está instalado");
  }
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
};

export const getProvider = () => {
  if (!window.ethereum) throw new Error("MetaMask no disponible");
  return new ethers.BrowserProvider(window.ethereum);
};

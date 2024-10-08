import { useEffect, useRef, useState } from 'react'
import { BrowserProvider, Contract, ethers, parseUnits, Signer } from "ethers"
import './App.css'
import contractMetaData from "../../artifacts/contracts/Gateway.sol/Gateway.json"
const contractAbi = contractMetaData.abi
const contractAddress = import.meta.env.VITE_GATEWAY_ADDRESS;

function App() {

  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [paidAmt, setPaidAmt] = useState<string | null>(null);

  async function loadBlockchainData() {
    const newProvider = new ethers.BrowserProvider(window.ethereum)
    setProvider(newProvider)
    console.log("newProvider: \n" + JSON.stringify(newProvider))
    const newSigner = await newProvider.getSigner()
    setSigner(newSigner)
    console.log("newSigner: \n" + JSON.stringify(newSigner))
    const newContract = new Contract(contractAddress, contractAbi, newSigner)
    setContract(newContract)

    const newAccount = await newSigner?.getAddress()
    setAccount(newAccount)
    console.log("newAccount: " + JSON.stringify(newAccount))
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <div>{account ? account : "not connected"}</div>
      <div>
        <PayToContractFC />
      </div>
    </div>
  )

  function PayToContractFC() {
    const amountRef = useRef<HTMLInputElement>(null)
    return (
      <div>
        <input ref={amountRef} placeholder='amount' type='number' />
        <button onClick={payToContract}>pay</button>
        <div onClick={getPaidAmount}>
          {paidAmt ? paidAmt : "getPaidAmount"}
        </div>
      </div>
    )

    async function payToContract() {
      const amountValue = amountRef.current?.value
      console.log("value: " + JSON.stringify(amountValue));
      console.log("value: " + amountValue);

      if (!contract) return;

      const tx = await contract.payToContract(parseUnits("0.00000001", "ether"), {
        value: ethers.parseUnits("0.0000001")
      })
      await tx.wait()
      const response = await contract.verifyTransaction(parseUnits("0.00000001", "ether"))

      console.log(JSON.stringify(response))
    }

    async function getPaidAmount() {
      if (!contract) {
        console.log("contract not connected")
        return
      }
      const paidAmount = await contract.getPaidAmount();
      setPaidAmt(paidAmount)
      console.log("paid: " + paidAmount.toString())
      console.log("paid: " + paidAmount)
    }
  }
}

export default App

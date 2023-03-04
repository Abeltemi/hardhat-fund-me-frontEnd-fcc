import { ethers } from "./ethers-5.1.esm.min.js"

import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectBut")
const fundButton = document.getElementById("fundBut")
const introText = document.getElementById("intro")
const showAccount = document.querySelector(".showAccount")

const getBalance = document.getElementById("balance")
const showBalance = document.getElementById("showBalance")
const withdrawButton = document.getElementById("withdraw")

connectButton.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
        introText.innerHTML = "MetaMask is connected"
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        })
        showAccount.innerHTML = accounts
    } else {
        document.getElementById("intro").innerHTML = "Please install MetaMask"
        console.log("MetaMask not Availalble!")
    }
})

fundButton.addEventListener("click", async () => {
    const ethAmount = document.getElementById("fundIn").value
    console.log(`Funding with: ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        /* 
      First You need Provider / connection to the blockchain
      signer / wallet / someone with some gas
      contract that we are interacting with
      ^ ABI & Address

      //listen for the tx to be mined -  create a new function for that
      */

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider)
        const sendValue = ethers.utils.parseEther(ethAmount)
        const signer = provider.getSigner()
        console.log(`Account Adderess: ${await signer.getAddress()}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // can now go ahead to make transaction with the contract
        try {
            const transactionResponse = await contract.fund({
                value: sendValue,
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
})

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Complete with ${transactionReceipt.confrimations} confirmations`
            )
            resolve()
        })
    })
}

getBalance.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(contractAddress)
            console.log(
                `Contract balance: ${ethers.utils.formatEther(balance)}`
            )
            showBalance.innerHTML = ethers.utils.formatEther(balance)
        } catch (error) {
            console.log(error)
        }
        // const signer = provider.getSigner()
        // const contract = new ethers.Contract(contractAddress, abi, signer)
        // const transactionResponse = await contract.getPriceFeed()
    }
})

withdrawButton.addEventListener("click", async () =>{
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await transactionResponse.wait(1)
            document.getElementById("amountWithdraw").innerHTML = ethers.utils.formatEther(balance)
        }catch(e){
            console.log(e)
        }
    }
})


// console.log(ethers)

// Mini DEX for JWR Token with upgraded styling

"use client";

import { useEffect, useState } from "react"; import { ethers } from "ethers";

const JWR_TOKEN = "0x4E54B5aeB805D826a6c1Ad8abC9cBf05E49457c3"; const USDT_TOKEN = "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf"; const ROUTER = "0xB91deeDbc60F3507D5206Df4E051A11b74C6158E";

const ABI_ERC20 = [ "function approve(address spender, uint amount) external returns (bool)", "function allowance(address owner, address spender) view returns (uint256)", "function balanceOf(address) view returns (uint256)" ];

const ABI_ROUTER = [ "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory)", "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)" ];

export default function Home() { const [provider, setProvider] = useState(); const [signer, setSigner] = useState(); const [account, setAccount] = useState(""); const [amountA, setAmountA] = useState(""); const [amountB, setAmountB] = useState(""); const [swapFrom, setSwapFrom] = useState(""); const [swapTo, setSwapTo] = useState(""); const [swapAmount, setSwapAmount] = useState("");

async function connect() { if (!window.ethereum) return alert("Please install MetaMask"); const provider = new ethers.BrowserProvider(window.ethereum); await provider.send("eth_requestAccounts", []); const signer = await provider.getSigner(); setProvider(provider); setSigner(signer); setAccount(await signer.getAddress()); }

async function approveAndAddLiquidity() { const tokenA = new ethers.Contract(JWR_TOKEN, ABI_ERC20, signer); const tokenB = new ethers.Contract(USDT_TOKEN, ABI_ERC20, signer); const router = new ethers.Contract(ROUTER, ABI_ROUTER, signer);

const amtA = ethers.parseUnits(amountA || "0", 18);
const amtB = ethers.parseUnits(amountB || "0", 18);

const allowA = await tokenA.allowance(account, ROUTER);
const allowB = await tokenB.allowance(account, ROUTER);

if (allowA < amtA) await tokenA.approve(ROUTER, amtA);
if (allowB < amtB) await tokenB.approve(ROUTER, amtB);

const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
await router.addLiquidity(JWR_TOKEN, USDT_TOKEN, amtA, amtB, 0, 0, account, deadline);
alert("Liquidity added successfully!");

}

async function approveAndSwap() { const tokenFrom = new ethers.Contract(swapFrom, ABI_ERC20, signer); const router = new ethers.Contract(ROUTER, ABI_ROUTER, signer); const amt = ethers.parseUnits(swapAmount || "0", 18);

const allow = await tokenFrom.allowance(account, ROUTER);
if (allow < amt) await tokenFrom.approve(ROUTER, amt);

const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
await router.swapExactTokensForTokens(
  amt,
  0,
  [swapFrom, swapTo],
  account,
  deadline
);
alert("Swap successful!");

}

return ( <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6"> <div className="max-w-xl mx-auto space-y-10"> <h1 className="text-4xl font-bold text-center text-cyan-400 drop-shadow-md">JWR Mini DEX</h1>

{!account ? (
      <button onClick={connect} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold shadow-lg">Connect Wallet</button>
    ) : (
      <>
        <div className="bg-gray-900 rounded-xl p-5 shadow-md">
          <h2 className="text-xl mb-4 text-cyan-300 font-semibold">Add Liquidity</h2>
          <input type="text" placeholder="Amount JWR" className="w-full p-3 mb-3 bg-gray-800 rounded border border-gray-700" value={amountA} onChange={e => setAmountA(e.target.value)} />
          <input type="text" placeholder="Amount USDT" className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700" value={amountB} onChange={e => setAmountB(e.target.value)} />
          <button onClick={approveAndAddLiquidity} className="w-full py-2 bg-green-600 hover:bg-green-500 rounded font-semibold">Add Liquidity</button>
        </div>

        <div className="bg-gray-900 rounded-xl p-5 shadow-md">
          <h2 className="text-xl mb-4 text-cyan-300 font-semibold">Swap</h2>
          <select className="w-full p-3 mb-3 bg-gray-800 rounded border border-gray-700" onChange={e => setSwapFrom(e.target.value)}>
            <option value="">Select Token From</option>
            <option value={JWR_TOKEN}>JWR</option>
            <option value={USDT_TOKEN}>USDT</option>
          </select>
          <select className="w-full p-3 mb-3 bg-gray-800 rounded border border-gray-700" onChange={e => setSwapTo(e.target.value)}>
            <option value="">Select Token To</option>
            <option value={JWR_TOKEN}>JWR</option>
            <option value={USDT_TOKEN}>USDT</option>
          </select>
          <input type="text" placeholder="Amount to Swap" className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} />
          <button onClick={approveAndSwap} className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded font-semibold">Swap</button>
        </div>
      </>
    )}
  </div>
</main>

); }


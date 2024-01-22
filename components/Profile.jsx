"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import { erc20abi as abi } from "../build/erc20abi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

import { factoryabi } from "../build/factoryabi";

//const ERC20_CONTRACT_ADDRESS = "0xFAf638da97163DeA7a1360a498295B04049b444b";
const ERC20_CONTRACT_ADDRESS = "0x847ca5Ab7625E7ab065e5306B43dc2134226a585";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const UNI_Factory = "0xDfE5Ae33064D447c82013F19Fe22038F4107d7D6";

function Profile() {
  const notify = (msg) => toast(msg);

  const [myBalance, setMyBalance] = useState("");
  const [resv, setResv] = useState("");
  const [resvAmt, setResvAmt] = useState("");
  const { address } = useAccount();
  const { data: balanceData } = useContractRead({
    address: ERC20_CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: [address || NULL_ADDRESS],
  });
  const { data: decimals } = useContractRead({
    address: ERC20_CONTRACT_ADDRESS,
    abi,
    functionName: "decimals",
  });

  useEffect(() => {
    setMyBalance(
      balanceData && decimals ? formatUnits(balanceData, decimals) : undefined
    );
  }, [balanceData, decimals]);

  //send tx
  const {
    data: txData,
    isSuccess,
    write: sendUniTx,
  } = useContractWrite({
    address: ERC20_CONTRACT_ADDRESS,
    abi,
    functionName: "transfer",
    args: [resv, resvAmt],
  });

  const { data: pair } = useContractRead({
    address: UNI_Factory,
    abi: factoryabi,
    functionName: "allPairsLength",
  });
  console.log(pair);

  return (
    <Card className="max-w-[400px] flex flex-col  bg-[#808080] text-[white]">
      <CardHeader>
        <p>Transfer ERC20</p>
      </CardHeader>

      <CardBody>
        <div>My Balance: {myBalance === undefined ? 0 : myBalance}</div>
        {myBalance && (
          <div className="flex flex-col justify-start gap-3">
            <label htmlFor="address">
              address:
              <input
                className="input input-bordered input-info w-full max-w-xs"
                type="text"
                name="address"
                id="address"
                value={resv}
                onChange={(e) => setResv(e.target.value)}
              />
            </label>
            <label htmlFor="amount" className="block">
              amount:
              <input
                className="input input-bordered input-info w-full max-w-xs"
                type="text"
                name="amount"
                id="amount"
                value={resvAmt}
                onChange={(e) => setResvAmt(e.target.value)}
              />
            </label>
            <CardFooter>
              <button
                className="bg-DarkColor hover:text-SecondaryColor m-auto rounded-md p-2 active:bg-SecondaryColor"
                onClick={() => sendUniTx()}
              >
                Send ERC20
              </button>
            </CardFooter>
            {isSuccess &&
              notify(`Transaction Hash: ${txData?.hash}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default Profile;

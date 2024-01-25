"use client";
import CoinDialog from "./CoinDialog";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFromCoin, setToCoin } from "@/lib/features/coins/coinsSlice";
import { Button, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Tabs, Tab, Card, Input, Divider } from "@nextui-org/react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useBlockNumber,
  useToken,
} from "wagmi";
import { useReadContract } from "wagmi";
import { erc20abi } from "@/abis/erc20abi";
import { routerv2abi } from "@/abis/routerv2abi";
import { factoryabi } from "@/abis/factoryabi";
import { pairabi } from "@/abis/pairabi";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const WTH_ = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
const UNI_Factory = "0x503Ae30302bEdC7dF301e05eE464f1bFD20085C7";
const UNI_Router02 = "0x440e24C674d2852CaAF58726335929e2e6Df276E";

export default function CreatePair() {
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [currentPair, setCurrentPair] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: pair, refetch: refetchPair } = useContractRead({
    address: UNI_Factory,
    abi: factoryabi,
    functionName: "getPair",
    args: [token0, token1],
  });

  const { data: token0Info } = useToken({
    address: token0,
  });

  const { data: token1Info } = useToken({
    address: token1,
  });

  useEffect(() => {
    setCurrentPair(pair);
  }, [pair]);

  useEffect(() => {
    refetchPair();
  }, [blockNumber]);

  const handleToken0Input = (addr) => {
    setToken0(addr);
  };

  const handleToken1Input = (addr) => {
    setToken1(addr);
  };

  const { write: writeContract } = useContractWrite({
    address: UNI_Factory,
    abi: factoryabi,
    functionName: "createPair",
    args: [token0, token1],
  });

  const handleCreate = () => {
    writeContract();
  };

  return (
    <div className="mx-3 mt-5">
      <div className="flex flex-col justify-start items-center gap-2">
        <div className="w-[95%]">
          <label>
            token0:
            <Input
              type="text"
              placeholder="0x..."
              size="sm"
              value={token0}
              onChange={(e) => handleToken0Input(e.target.value)}
            />
          </label>
        </div>
        <div className="w-[95%]">
          <label>
            token1:
            <Input
              type="text"
              placeholder="0x..."
              size="sm"
              value={token1}
              onChange={(e) => handleToken1Input(e.target.value)}
            />
          </label>
        </div>
      </div>
      <Divider className="my-5" />
      <div>
        <div className="flex flex-row flex-start">
          <div className="w-1/2">token0: {token0Info?.symbol}</div>
          <div className="w-1/2">token1: {token1Info?.symbol}</div>
        </div>
        <Divider className="my-5" />
        <div>
          Pair:
          {currentPair === "0x0000000000000000000000000000000000000000"
            ? "not created"
            : currentPair}
        </div>
      </div>

      <Button
        className="w-full h-[50px] font-bold rounded-md mb-5 mt-5"
        color="primary"
        onClick={() => handleCreate()}
      >
        Create
      </Button>
    </div>
  );
}

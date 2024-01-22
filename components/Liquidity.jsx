"use client";
import CoinDialog from "./CoinDialog";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFromCoin, setToCoin } from "../app/lib/features/coins/coinsSlice";
import { Button, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Tabs, Tab, Card, Input, Divider } from "@nextui-org/react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useBlockNumber,
} from "wagmi";
import { useReadContract } from "wagmi";
import { erc20abi } from "@/abis/erc20abi";
import { routerv2abi } from "@/abis/routerv2abi";
import { factoryabi } from "@/abis/factoryabi";
import { pairabi } from "@/abis/pairabi";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
//const UNI_Factory = "0xDfE5Ae33064D447c82013F19Fe22038F4107d7D6";
const UNI_Factory = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
const UNI_Router02 = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
const WTH_ = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

export default function Liquidity() {
  const dispatch = useDispatch();
  const fromCoin = useSelector((state) => state.coins.fromCoin);
  const toCoin = useSelector((state) => state.coins.toCoin);
  const [fromCoinAmt, setFromCoinAmt] = useState("0.0");
  const [toCoinAmt, setToCoinAmt] = useState("0.0");
  const [balanceFrom, setBalanceFrom] = useState("0");
  const [balanceTo, setBalanceTo] = useState("0");
  const [currentPair, setCurrentPair] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const { address, status, isConnected } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: balanceDataFrom, refetch: refetchFromBalance } = useBalance({
    address: address,
    token: fromCoin.address,
  });

  const { data: balanceDataTo, refetch: refetchToBalance } = useBalance({
    address: address,
    token: toCoin.address,
  });

  const { data: pair, refetch: refetchPair } = useContractRead({
    address: UNI_Factory,
    abi: factoryabi,
    functionName: "getPair",
    args: [fromCoin.address ? fromCoin.address : WTH_, toCoin.address],
  });

  const { data: reserves, refetch: refetchReserves } = useContractRead({
    address: currentPair,
    abi: pairabi,
    functionName: "getReserves",
  });

  const { data: token0, refetch: refetchToken0 } = useContractRead({
    address: currentPair,
    abi: pairabi,
    functionName: "token0",
  });

  const { data: token1, refetch: refetchToken1 } = useContractRead({
    address: currentPair,
    abi: pairabi,
    functionName: "token1",
  });

  const { data: amountTo, refetch: refetchAmountTo } = useContractRead({
    address: UNI_Router02,
    abi: routerv2abi,
    functionName: "getAmountOut",
    args: [
      fromCoinAmt,
      reserves ? (token0 === fromCoin.address ? reserves[0] : reserves[1]) : 0,
      reserves ? (token0 === fromCoin.address ? reserves[1] : reserves[0]) : 0,
    ],
  });

  const { write: writeContract } = useContractWrite({
    address: UNI_Router02,
    abi: routerv2abi,
    functionName: "swapTokensForExactTokens",
    args: [
      amountTo,
      fromCoinAmt * 1.5,
      [fromCoin.address, toCoin.address],
      address,
      1715809339,
    ],
  });

  useEffect(() => {
    setCurrentPair(pair);
  }, [pair]);

  useEffect(() => {
    setBalanceFrom(
      balanceDataFrom?.value && balanceDataFrom?.decimals
        ? formatUnits(balanceDataFrom.value, balanceDataFrom.decimals)
        : "0"
    );
  }, [balanceDataFrom]);

  useEffect(() => {
    setBalanceTo(
      balanceDataTo?.value && balanceDataTo?.decimals
        ? formatUnits(balanceDataTo.value, balanceDataTo.decimals)
        : "0"
    );
  }, [balanceDataTo]);

  useEffect(() => {
    if (amountTo) {
      setToCoinAmt(amountTo.toString());
    }
  }, [amountTo]);

  useEffect(() => {
    refetchFromBalance();
    refetchToBalance();
    refetchPair();
    refetchToken0();
    refetchToken1();
    refetchReserves();
    refetchAmountTo();
  }, [blockNumber]);

  const handleAddLiquidity = () => {
    if (fromCoinAmt > 0) {
      writeContract();
      setFromCoinAmt("0");
      setToCoinAmt("0");
    }
  };

  return (
    <Card>
      <CardBody>
        <Tabs>
          <Tab key={"createPair"} title="Create Pair">
            <div className="flex flex-row justify-evenly">
              <div>
                <CoinDialog
                  coin={fromCoin.abbr}
                  setCoin={(abbr) => dispatch(setFromCoin(abbr))}
                />
              </div>

              <div>
                <CoinDialog
                  coin={toCoin.abbr}
                  setCoin={(abbr) => dispatch(setToCoin(abbr))}
                />
              </div>
            </div>
            <div>Pair: {currentPair}</div>

            <Button
              className="w-full h-[50px] font-bold rounded-md mb-5"
              color="primary"
              onClick={() => handleAddLiquidity()}
            >
              Create
            </Button>
          </Tab>
          <Tab key={"addLiquidity"} title="Add Liquidity">
            <div className=" flex flex-col gap-7">
              <div className="bg-[#f0f0f0] h-[90px] w-4/5 m-auto  rounded-lg flex flex-col">
                <div className="flex flex-row justify-center gap-3 items-center px-5 pt-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="0.0"
                      size="sm"
                      value={fromCoinAmt}
                      onChange={(e) => setFromCoinAmt(e.target.value)}
                    />
                  </div>
                  <div>
                    <CoinDialog
                      coin={fromCoin.abbr}
                      setCoin={(abbr) => dispatch(setFromCoin(abbr))}
                    />
                  </div>
                </div>
                <div className="text-end pr-5">balance: {balanceFrom}</div>
              </div>
              <div className="bg-[#f0f0f0] h-[90px] w-4/5 m-auto  rounded-lg flex flex-col">
                <div className="flex flex-row justify-center gap-3 items-center px-5 pt-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="0.0"
                      size="sm"
                      value={toCoinAmt}
                      onChange={(e) => setToCoinAmt(e.target.value)}
                    />
                  </div>
                  <div>
                    <CoinDialog
                      coin={toCoin.abbr}
                      setCoin={(abbr) => dispatch(setToCoin(abbr))}
                    />
                  </div>
                </div>
                <div className="text-end pr-5">balance: {balanceTo}</div>
              </div>
            </div>
            <div className="my-5 w-4/5 m-auto text-start flex flex-col justify-start">
              <div className="pb-5">初始兑换率和流动池份额</div>
              <Divider />
              <div className="text-sm text-[#808080]">
                * Pair: {currentPair}
                <div>* Reserves</div>
                {reserves && (
                  <div>
                    {fromCoin.abbr}:{" "}
                    {token0 === fromCoin.address
                      ? formatUnits(reserves[0], balanceDataFrom.decimals)
                      : formatUnits(reserves[1], balanceDataFrom.decimals)}
                  </div>
                )}
                {reserves && (
                  <div>
                    {toCoin.abbr}:{" "}
                    {token0 === toCoin.address
                      ? formatUnits(reserves[0], balanceDataFrom.decimals)
                      : formatUnits(reserves[1], balanceDataFrom.decimals)}
                  </div>
                )}
              </div>
            </div>
            <Divider />
            <div className="w-4/5 m-auto">
              <Button
                className="w-full h-[50px] font-bold rounded-md mb-5"
                color="primary"
                onClick={() => handleAddLiquidity()}
              >
                Add Liquidity
              </Button>
            </div>
          </Tab>
          <Tab key={"removeLiquidity"} title="Remove Liquidity"></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

"use client";
import CoinDialog from "./CoinDialog";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFromCoin, setToCoin } from "@/lib/features/coins/coinsSlice";
import { Button, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Card, Input, Divider } from "@nextui-org/react";
import { formatUnits, parseUnits } from "viem";
import { sepolia } from "wagmi";

import {
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useBlockNumber,
  useTransaction,
} from "wagmi";
import { useReadContract } from "wagmi";
import { erc20abi } from "@/abis/erc20abi";
import { routerv2abi } from "@/abis/routerv2abi";
import { factoryabi } from "@/abis/factoryabi";
import { pairabi } from "@/abis/pairabi";

const MAX_INT = 0xffffffffffffffffffff;
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const WTH_ = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; //TODO get from router
const UNI_Factory = "0x503Ae30302bEdC7dF301e05eE464f1bFD20085C7"; //TODO get from router
const UNI_Router02 = "0x440e24C674d2852CaAF58726335929e2e6Df276E";
//external
//const UNI_Factory = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
//const UNI_Router02 = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";

export default function SwapCoins() {
  const dispatch = useDispatch();
  const fromCoin = useSelector((state) => state.coins.fromCoin);
  const toCoin = useSelector((state) => state.coins.toCoin);

  const [fromCoinAmt, setFromCoinAmt] = useState("");
  const [toCoinAmt, setToCoinAmt] = useState("");
  const [balanceFrom, setBalanceFrom] = useState("0");
  const [balanceTo, setBalanceTo] = useState("0");
  const [currentPair, setCurrentPair] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [dir, setDir] = useState(0); //0 from-to; 1 to-from

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

  const { data: amountFrom, refetch: refetchAmountFrom } = useContractRead({
    address: UNI_Router02,
    abi: routerv2abi,
    functionName: "getAmountIn",
    args: [
      toCoinAmt,
      reserves ? (token0 === fromCoin.address ? reserves[0] : reserves[1]) : 0,
      reserves ? (token0 === fromCoin.address ? reserves[1] : reserves[0]) : 0,
    ],
  });

  const { write: writeContract } = useContractWrite({
    address: UNI_Router02,
    abi: routerv2abi,
    functionName:
      dir === 0 ? "swapExactTokensForTokens" : "swapTokensForExactTokens",
    args: [
      dir === 0 ? fromCoinAmt : toCoinAmt,
      dir === 0 ? Math.floor(toCoinAmt * 0.95) : Math.floor(fromCoinAmt * 1.05),
      [fromCoin.address, toCoin.address],
      address,
      Math.floor(Date.now() / 1000) + 200000,
    ],
    onSettled(data) {
      setFromCoinAmt("");
      setToCoinAmt("");
    },
  });

  const { data: allowanceFrom, refetch: refetchAllowanceFrom } =
    useContractRead({
      address: fromCoin.address,
      abi: erc20abi,
      functionName: "allowance",
      args: [address, UNI_Router02],
    });

  const {
    data: txhash,
    writeAsync: allowFromAsync,
    write: allowFrom,
  } = useContractWrite({
    address: fromCoin.address,
    abi: erc20abi,
    functionName: "approve",
    args: [UNI_Router02, MAX_INT],
  });

  const {
    data: rep,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    isFetching,
    isFetched,
    status: txstatus,
    refetch: refetchReceipt,
  } = useTransaction({
    confirmations: 3,
    hash: txhash?.hash,
    onSuccess(data) {
      refetchAllowanceFrom();
    },
  });

  /*
  useEffect(() => {
    console.log("hhahahaha", isSuccess);
    if (isSuccess) {
      //writeContract();
      console.log("hhah", rep);
      console.log("hhah", txstatus);
      writeContract();
      console.log(
        "hhah",
        isError,
        isIdle,
        isLoading,
        isSuccess,
        isFetching,
        isFetched
      );
    }
  }, [isSuccess]);
  */

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
    if (!dir) {
      setToCoinAmt(amountTo?.toString());
    }
  }, [amountTo]);

  useEffect(() => {
    if (dir) {
      setFromCoinAmt(amountFrom?.toString());
    }
  }, [amountFrom]);

  useEffect(() => {
    refetchFromBalance();
    refetchToBalance();
    refetchPair();
    refetchToken0();
    refetchToken1();
    refetchReserves();
    refetchAmountTo();
    refetchAmountFrom();
    refetchAllowanceFrom();
    refetchReceipt();
  }, [blockNumber]);

  const handleSwap = () => {
    if (fromCoinAmt > 0) {
      if (allowanceFrom < fromCoinAmt) {
        allowFrom();
      } else {
        writeContract();
      }
    }
  };

  const handleFromInput = (v) => {
    setFromCoinAmt(v ? parseUnits(v, 18).toString() : "");
    setDir(0);
  };

  const handleToInput = (v) => {
    setToCoinAmt(v ? parseUnits(v, 18).toString() : "");
    setDir(1);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="w-fit m-auto font-bold">Swap Coins</div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className=" flex flex-col gap-7 mt-5">
            <div className="bg-[#f0f0f0] h-[90px] w-4/5 m-auto  rounded-lg flex flex-col">
              <div className="text-[0.6rem] text-start pl-5 py-1">
                contract: {fromCoin.address}
              </div>
              <div className="flex flex-row justify-center gap-3 items-center px-5">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    size="sm"
                    value={fromCoinAmt ? formatUnits(fromCoinAmt, 18) : ""}
                    onChange={(e) => handleFromInput(e.target.value)}
                  />
                </div>
                <div>
                  <CoinDialog
                    coin={fromCoin.abbr}
                    setCoin={(coin) => dispatch(setFromCoin(coin))}
                  />
                </div>
              </div>
              <div className="text-end pr-5">balance: {balanceFrom}</div>
            </div>
            <div className="bg-[#f0f0f0] h-[90px] w-4/5 m-auto  rounded-lg flex flex-col">
              <div className="text-[0.6rem] text-start pl-5 py-1">
                contract: {toCoin.address}
              </div>
              <div className="flex flex-row justify-center gap-3 items-center px-5">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="0"
                    size="sm"
                    value={toCoinAmt ? formatUnits(toCoinAmt, 18) : ""}
                    onChange={(e) => handleToInput(e.target.value)}
                  />
                </div>
                <div>
                  <CoinDialog
                    coin={toCoin.abbr}
                    setCoin={(coin) => dispatch(setToCoin(coin))}
                  />
                </div>
              </div>
              <div className="text-end pr-5">balance: {balanceTo}</div>
            </div>
          </div>
          <div className="my-5 w-4/5 m-auto text-start flex flex-col justify-start">
            <div className="pb-5">
              {amountTo && (
                <div>
                  1 {fromCoin.abbr} ={" "}
                  {parseInt(amountTo.toString()) / fromCoinAmt} {toCoin.abbr}
                </div>
              )}
            </div>
            <Divider />
            <div className="text-sm text-[#808080]">
              <div>* Pair: {currentPair}</div>
              {/*
              <div>
                * Allowance ({fromCoin.abbr}): {allowanceFrom?.toString() || ""}
              </div> */}
              <div>* Reserves</div>
              <div>
                {reserves && (
                  <div>
                    - {fromCoin.abbr}:{" "}
                    {token0 === fromCoin.address
                      ? formatUnits(reserves[0], 18)
                      : formatUnits(reserves[1], 18)}
                  </div>
                )}
              </div>
              <div>
                {reserves && (
                  <div>
                    - {toCoin.abbr}:{" "}
                    {token0 === toCoin.address
                      ? formatUnits(reserves[0], 18)
                      : formatUnits(reserves[1], 18)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-4/5 m-auto">
            <Button
              className="w-full h-[50px] font-bold rounded-md mb-5"
              color="primary"
              onClick={() => handleSwap()}
            >
              {allowanceFrom < fromCoinAmt ? "Approval to Swap" : "Swap"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

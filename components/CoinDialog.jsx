"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { FaAngleDown } from "react-icons/fa";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useContractRead,
  useBlockNumber,
  useToken,
} from "wagmi";

const SEPOLIACoins = [
  /*
  {
    name: "Ether",
    abbr: "ETH",
    address: "", // Weth address is fetched from the router
  },
  */
  {
    name: "Tether USD",
    abbr: "USDT",
    address: "0x91364cC52331AB33de4C3AB63054d6B469242bD4",
  },
  {
    name: "my20token",
    abbr: "token20",
    address: "0xf0636275361714540E5be5183a551f94c5ecc1e0",
  },
  {
    name: "MyToken",
    abbr: "MTK",
    address: "0xFAf638da97163DeA7a1360a498295B04049b444b",
  },
];

export default function CoinDialog({ coin, setCoin }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState("");
  const [tokenList, setTokenList] = useState(SEPOLIACoins);

  const { data: tokenInfo } = useToken({
    address: token,
  });

  const handleTokenInput = (addr) => {
    setToken(addr);
  };

  useEffect(() => {
    if (tokenInfo?.symbol) {
      if (
        tokenList.filter((x) => x.address === tokenInfo?.address).length === 0
      ) {
        setTokenList(
          [
            ...tokenList,
            { address: token, abbr: tokenInfo?.symbol, name: tokenInfo?.name },
          ].filter((x) => x.address === token)
        );
      } else {
        setTokenList(tokenList.filter((x) => x.address === token));
      }
    } else {
      setTokenList(SEPOLIACoins);
    }
  }, [tokenInfo]);

  const onClicked = (token, close) => {
    setCoin(token);
    setTokenList(SEPOLIACoins);
    setToken("");
    close();
  };

  const clearHandler = () => {
    setToken("");
    setTokenList(SEPOLIACoins);
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" radius="sm">
        <div className="flex justify-center items-center">
          <span>{coin}</span>
          <FaAngleDown />
        </div>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Coin
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  isClearable
                  placeholder="Paste Address"
                  variant="bordered"
                  value={token}
                  onChange={(e) => handleTokenInput(e.target.value)}
                  onClear={() => clearHandler()}
                />
                <div className="border-t-1"></div>
                <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                  <Listbox
                    variant="flat"
                    aria-label="Listbox menu with descriptions"
                  >
                    {tokenList.map((x) => {
                      return (
                        <ListboxItem
                          key={x.abbr}
                          description={
                            <div>
                              {x.abbr}
                              <span className="text-[0.5rem] ml-3">
                                {x.address}
                              </span>
                            </div>
                          }
                          onClick={() => onClicked(x, onClose)}
                        >
                          {x.name}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

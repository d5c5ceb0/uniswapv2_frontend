"use client";
import React, { useState } from "react";
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

const SEPOLIACoins = [
  {
    name: "Ether",
    abbr: "ETH",
    address: "", // Weth address is fetched from the router
  },
  {
    name: "wbtc",
    abbr: "WBTC",
    address: "0x29f2D40B0605204364af54EC677bD022dA425d03",
  },
  {
    name: "Tether USD",
    abbr: "USDT",
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
  },
  {
    name: "my20token",
    abbr: "token20",
    address: "0xf0636275361714540E5be5183a551f94c5ecc1e0",
  },
  {
    name: "MTK",
    abbr: "MTK",
    address: "0xFAf638da97163DeA7a1360a498295B04049b444b",
  },
];

export default function CoinDialog({ coin, setCoin }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onClicked = (token, close) => {
    setCoin(token);
    close();
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
                  placeholder="Paste Address"
                  variant="bordered"
                />
                <div className="border-t-1"></div>
                <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                  <Listbox
                    variant="flat"
                    aria-label="Listbox menu with descriptions"
                  >
                    {SEPOLIACoins.map((x) => {
                      return (
                        <ListboxItem
                          key={x.abbr}
                          description={x.abbr}
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
                <Button color="primary" onPress={onClose}>
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

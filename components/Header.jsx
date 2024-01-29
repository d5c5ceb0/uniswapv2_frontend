"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation.js";
import clsx from "clsx";
import { DiscordLogo } from "./DiscordLogo";

const links = [
  { name: "Swap", href: "/" },
  { name: "Liquidity", href: "/liquidity" },
];

export default function Header() {
  const pathName = usePathname();

  return (
    <Navbar maxWidth="lg" height={"45px"} className="bg-[#15151d]">
      <NavbarBrand>
        {/*<DiscordLogo />*/}
        <Link href={"/"} color="primary">
          <h1 className="text-white font-[600] text-[1.2rem]">
            UniswapV2 for Sepolia
          </h1>
        </Link>
      </NavbarBrand>
      <NavbarContent className="flex gap-12" justify="start">
        {links.map((x, idx) => {
          return (
            <NavbarItem key={idx} isActive={pathName === x.href ? true : false}>
              <Link href={x.href} color="primary">
                <span
                  className={clsx(
                    "text-[16px] text-[white] hover:text-pink-300",
                    pathName === x.href && "text-pink-300"
                  )}
                >
                  {x.name}
                </span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent className="" justify="end">
        <NavbarItem>
          <ConnectButton
            label="connect wallet"
            showBalance={false}
            chainStatus={{
              largeScreen: "icon",
              smallScreen: "icon",
            }}
            accountStatus={{
              largeScreen: "full",
              smallScreen: "avatar",
            }}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

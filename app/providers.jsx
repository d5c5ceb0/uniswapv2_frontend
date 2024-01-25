"use client";

import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import store from "@/lib/store";
import { Provider } from "react-redux";

const NEXT_PUBLIC_ENABLE_TESTNETS = "true";
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  [
    alchemyProvider({ apiKey: "yDR_E854Lv-T48BRKXaFZfemD-Z5eg9Y" }),
    publicProvider(),
  ]
);

const projectId = "2d0134c0c22967b23094ec21963508cd";
//const { connectors } = getDefaultWallets({
//  appName: "My Test App",
//  projectId: projectId,
//  chains,
//});

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#f26829",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            {children}
            <ToastContainer />
          </RainbowKitProvider>
        </WagmiConfig>
      </Provider>
    </NextUIProvider>
  );
}

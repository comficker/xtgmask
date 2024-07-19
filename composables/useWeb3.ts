import { defaultWagmiConfig } from "@web3modal/wagmi";
import { arbitrum, arbitrumSepolia, avalanche, avalancheFuji } from "viem/chains";

export default function useWeb3() {
  const runtimeConfig = useRuntimeConfig();
  const metadata = {
    name: "Stavax",
    description: "The first SocialFi & Gaming Omnichain",
    url: "https://stavax.io", // origin must match your domain & subdomain
    icons: ["https://cdn.stavax.io/thumb/stavax.png"],
  };

  const isTestnet = !runtimeConfig.public.env || runtimeConfig.public.env === "development";
  const connectWalletID = <string>runtimeConfig.public.connectWalletId;
  const chains = isTestnet ? [avalancheFuji, arbitrumSepolia] : [avalanche, arbitrum];
  const config = defaultWagmiConfig({
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    chains, // required
    projectId: connectWalletID, // required
    metadata, // required
    enableWalletConnect: true, // Optional - true by default
    enableInjected: true, // Optional - true by default
    enableEIP6963: false, // Optional - true by default
    enableCoinbase: false, // Optional - true by default
  });
  return {
    chains,
    config,
  };
}

import { defineStore } from "pinia";
import { arbitrum, arbitrumSepolia, avalanche, avalancheFuji } from "viem/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi";

export const useWeb3Store = defineStore("web3", {
  state: (): { address: `0x${string}` | null } => ({
    address: null,
  }),

  getters: {
    wagmiConfig() {
      const config = useRuntimeConfig();
      const projectId = <string>config.public.connectWalletId;

      const isTestnet = config.public.env === "development";
      const chains = isTestnet ? [avalancheFuji, arbitrumSepolia] : [avalanche, arbitrum];
      return defaultWagmiConfig({
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        chains, // required
        projectId, // required
        metadata: {
          name: "Stavax",
          description: "The first SocialFi & Gaming Omnichain",
          url: "https://stavax.io", // origin must match your domain & subdomain
          icons: ["https://cdn.stavax.io/thumb/stavax.png"],
        }, // required
        enableWalletConnect: true, // Optional - true by default
        enableInjected: true, // Optional - true by default
        enableEIP6963: false, // Optional - true by default
        enableCoinbase: false, // Optional - true by default
      });
    },
  },
  actions: {
    setAddress(address: `0x${string}` | null) {
      this.address = address;
    },
  },
});

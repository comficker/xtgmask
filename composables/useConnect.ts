import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/vue";
import { disconnect, getBalance, getAccount as getWalletAccount, reconnect, signMessage, watchAccount } from "@wagmi/core";
import { SIGN_MESSAGE_CONTENT } from "~/constants";
import {useWeb3Store} from "~/store/web3";

export function useWalletConnect() {
  const runtimeConfig = useRuntimeConfig();
  const web3Store = useWeb3Store();

  const projectId = <string>runtimeConfig.public.connectWalletId;

  const address = ref<string>("");
  const clickedConnect = ref(false);

  const wConfig = computed(() => web3Store.wagmiConfig);

  createWeb3Modal({
    wagmiConfig: wConfig.value,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    themeMode: "dark",
    featuredWalletIds: [],
  });

  const modal = useWeb3Modal();

  const connected = computed(() => !!address.value);

  reconnect(wConfig.value).then();

  async function openWeb3Modal() {
    if (!address.value) {
      clickedConnect.value = true;
      await modal.open();
    }
  }

  async function closeWeb3Modal() {
    await modal.close();
  }

  async function handleDisconnect() {
    await disconnect(wConfig.value);
  }

  function getAccount() {
    return getWalletAccount(wConfig.value);
  }

  async function getTokenBalance(walletAddress: `0x${string}`, chainId: number, tokenAddress: `0x${string}`) {
    try {
      const balance = await getBalance(wConfig.value, {
        address: walletAddress,
        chainId,
        token: tokenAddress,
      });

      return balance.value;
    }
    catch (error) {
      return 0n;
    }
  }

  async function handleSignMessage() {
    try {
      return await signMessage(wConfig.value, {
        message: SIGN_MESSAGE_CONTENT,
      });
    }
    catch (error) {}
  }

  onMounted(() => {
    watchAccount(wConfig.value, {
      onChange(data: any) {
        address.value = (data.address as string) || "";
      },
    });
  });

  return {
    address,
    connected,
    modal,
    getAccount,
    openWeb3Modal,
    closeWeb3Modal,
    getTokenBalance,
    handleSignMessage,
    handleDisconnect,
  };
}

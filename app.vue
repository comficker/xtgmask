<template>
  <div class="h-screen w-scree flex justify-center items-center">
    <Button @click="connectWl">Test Connect</Button>
  </div>
</template>
<script setup lang="ts">
import {WalletManager} from "~/lib/w3";

const connectWl = () => {
  const metadata = {
    name: 'Cat vs Monster',
    description: 'Cat vs Monster',
    url: 'https://t.me/cat_vs_monster_bot/app',
    icons: ['https://catvsmonster.io/icon.png'],
  }

  const onWalletChange = (wallet: string) => {
    console.log('wallet change')
    console.log(wallet)
  }

  const manager = new WalletManager(metadata, onWalletChange, 'testnet')
  manager.connect()
}
</script>

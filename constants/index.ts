export const networks = {
  mainnet: 'mainnet',
  testnet: 'testnet'
} as const;

export type NetworkKey = keyof typeof networks;
export type Network = typeof networks[NetworkKey];

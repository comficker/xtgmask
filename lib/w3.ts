import {sei, seiTestnet} from '@wagmi/core/chains'
import type {Metadata} from '~/types'
import type {Network} from '~/constants'
import {connect, disconnect, getAccount, watchAccount, createConfig, http, getConnectors} from '@wagmi/core'
import {walletConnect} from '@wagmi/connectors'

const defaultProjectId = "b040a934c8c2b40cc69e1d3cca909847"


class WalletManager {
    chain: any
    config: any
    unwatch: any

    constructor(metadata: Metadata, onStatusChange: any = null, network: Network, projectId: string = defaultProjectId,) {
        const chain = network === 'mainnet' ? sei : seiTestnet
        this.chain = chain
        this.config = createConfig({
            chains: [chain],
            connectors: [
                walletConnect({
                    projectId,
                    metadata,
                    showQrModal: false,
                })
            ],
            // @ts-ignore
            transports: {
                [chain.id]: http(),
            },
        })

        if (onStatusChange) {
            this.unwatch = watchAccount(this.config, onStatusChange)
        }

    }

    async connect() {
        const connectors = getConnectors(this.config)
        const walletConnectConnector = connectors.find(c => c.id === 'walletConnect')
        if (!walletConnectConnector) {
            throw new Error('missing walletConnect connector')
        }
        const onDisplayURI = async (payload: any) => {
            if (payload.type === 'display_uri') {
                walletConnectConnector?.emitter.off('message', onDisplayURI)
                const metaMaskDeepLink = `https://metamask.app.link/wc?uri=${encodeURIComponent(payload.data)}`
                console.log("metaMaskDeepLink: ", metaMaskDeepLink)
                // @ts-ignore
                window.Telegram?.WebApp.openLink(metaMaskDeepLink)
            }
        }
        walletConnectConnector.emitter.on('message', onDisplayURI)
        await connect(this.config, {connector: walletConnectConnector, chainId: this.chain.id})
    }

    async disconnect() {
        await disconnect(this.config).catch(console.error)
        localStorage.removeItem("wagmi.store")
        localStorage.removeItem("wagmi.recentConnectorId")
        localStorage.removeItem("@w3m/connected_connector")
    }

    async getWalletAddress() {
        const account = getAccount(this.config)
        return account.address
    }

    isConnected() {
        const account = getAccount(this.config)
        return account.isConnected
    }

    getWalletInfo() {
        return getAccount(this.config)
    }

    isSetNetwork() {
        return this.chain.id === getAccount(this.config).chainId
    }
}

export {
    WalletManager
}


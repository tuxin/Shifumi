import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Image } from '@chakra-ui/react'
import "@fontsource/cinzel-decorative"
import "@fontsource/alice"

const Header = () => {
    return (
        <Flex bg='red.500' justifyContent="space-between" alignItems="center" height="6vh" width="100%" p="2rem">
            <Flex width="10%" justifyContent="space-between" alignItems="center">
                <Image width="50%" src='/logo.png' alt='Shifumi' />
                <Text fontFamily="Cinzel Decorative" fontSize="2rem">Shifumi</Text>
            </Flex>
            <Flex width="60%" justifyContent="space-between" alignItems="left">
                <Text fontFamily="Alice" color="white" fontWeight="bold"><Link href="/">Home</Link></Text>
                <Text color="#ffa0a8"><Link href="/getNumber">Get the number</Link></Text>
                <Text color="#ffa0a8"><Link href="/setNumber">Set the number</Link></Text>
            </Flex>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                    return (
                    <div
                        {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                        },
                        })}
                    >
                        {(() => {
                        if (!connected) {
                            return (
                            <button onClick={openConnectModal} type="button" >
                                Connect Wallet
                            </button>
                            );
                        }

                        if (chain.unsupported) {
                            return (
                            <button onClick={openChainModal} type="button">
                                Wrong network
                            </button>
                            );
                        }

                        return (
                            <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={openChainModal}
                                style={{ display: 'flex', alignItems: 'center' }}
                                type="button"
                            >
                                {chain.hasIcon && (
                                <div
                                    style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                    }}
                                >
                                    {chain.iconUrl && (
                                    <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 12, height: 12 }}
                                    />
                                    )}
                                </div>
                                )}
                                {chain.name}
                            </button>

                            <button onClick={openAccountModal} type="button">
                                {account.displayName}
                                {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </button>
                            </div>
                        );
                        })()}
                    </div>
                    );
                }}
            </ConnectButton.Custom>
        </Flex>
    )   
}

export default Header;
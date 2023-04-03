import Image from 'next/image'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,useColorMode} from '@chakra-ui/react'
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressBank, abiBank } from "../../public/contracts/ConstantsBankShifumi.js"
import React, { useEffect, useState } from 'react';


const TokenAllow = () => {
  
  const { address, isConnected } = useAccount()
  const  provider  = useProvider()
  const { colorMode, toggleColorMode } = useColorMode()
  const [winningAmoutMessage, setWinningAmount] = useState("1 x 1,97 = 1,97");
  const [multiplicator, setMultiplicator] = useState(null)
  const [allowtoken, setListeAllowToken] = useState(null)
  const handleWinningAmountChange  = (event) => {
    setWinningAmount(event.target.value);
  };

  useEffect(()=> {
      if(isConnected){
        getDatas()
      }
  },[address])

  
  const getDatas = async() => {
    const contractBank = new ethers.Contract(contractAddressBank,abiBank,provider)
    const arrayAllowToken = await contractBank.getBalanceAllowTokens(address)
      
    const tableallowtoken= arrayAllowToken.map((allowTokens,index) =>   
        <Tr height="5px">
        <Td><Image width="48" height="48" src={`/tokenwhitelist//${arrayAllowToken[0][index]}.png`} alt='Shifumi' /></Td>
        <Td>{arrayAllowToken[0][index]}</Td>
        <Td isNumeric>{ethers.utils.formatEther(arrayAllowToken[1][index])}</Td>
        </Tr>
    );
    setListeAllowToken(tableallowtoken)


    
    provider.getBalance(address).then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log(`balance: ${balanceInEth} ETH`)
     })
  }


  return (
    <>
    <TableContainer>
        <Table variant='simple'>
            <TableCaption>Select your coin</TableCaption>
            <Thead>
            <Tr>
                <Th></Th>
                <Th>Coins</Th>
                <Th isNumeric>Your balance</Th>
            </Tr>
            </Thead>
            <Tbody>
           {allowtoken}
                
            <Tr height="5px">
                <Td><Image width="48" height="48" src='/matic_balance.png' alt='Shifumi' /></Td>
                <Td>MATIC</Td>
                <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
                <Td><Image width="48" height="48" src='/ethereum_balance.png' alt='Shifumi' /></Td>
                <Td>ETH</Td>
                <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
                <Td><Image width="48" height="48" src='/usdc_balance.png' alt='Shifumi' /></Td>
                <Td>USDC</Td>
                <Td isNumeric>307.12</Td>
            </Tr>
            </Tbody>
        </Table>
        </TableContainer>
    </>
  )
}

export default TokenAllow;
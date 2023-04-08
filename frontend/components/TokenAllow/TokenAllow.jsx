import Image from 'next/image'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Text} from '@chakra-ui/react'
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressBank, abiBank } from "../../public/contracts/ConstantsBankShifumi.js"
import { abiERC20 } from "../../public/contracts/ConstantsERC20.js"
import React, { useEffect, useState } from 'react';


const TokenAllow = () => {
  
  const { address, isConnected } = useAccount()
  const  provider  = useProvider()
  const [allowtoken, setListeAllowToken] = useState(null)
  const handleWinningAmountChange  = (event) => {
    setWinningAmount(event.target.value);
  };

  useEffect(()=> {
      if(isConnected){
        getDatas()
      }
  },[address])

  const setSelectedRow  = async(name,addressToken) => {
    //allowanceverification
    document.getElementById("inputaddress").value=addressToken
    document.getElementById("inputaddressname").value=name
    if(document.getElementById("inputaddress").value!=ethers.constants.AddressZero){
      if(document.getElementById("inputvaluebet").value>0){
        const contractERC20 = new ethers.Contract(addressToken,abiERC20,provider)
        const arrayAllowToken = await contractERC20.allowance(address,contractAddressBank)

        if(document.getElementById("inputvaluebet").value>ethers.utils.formatEther(arrayAllowToken)){
          document.getElementById("buttonconnect").innerHTML="Approve "+name
        }else{
          "Heads to win "+name
        }
        
      }else{
        document.getElementById("buttonconnect").innerHTML="Heads to win "+name
      }
    }else{
      document.getElementById("buttonconnect").innerHTML="Heads to win "+name
    }

    
  };
 
  
  
  const getDatas = async() => {
    const contractBank = new ethers.Contract(contractAddressBank,abiBank,provider)
    const arrayAllowToken = await contractBank.getBalanceAllowTokens(address)
    const arrayToken = await contractBank.getAllowToken()
    const tableallowtoken= arrayAllowToken.map((allowTokens,index) =>   
        <Tr key={index} onClick={() => setSelectedRow(arrayAllowToken[0][index],arrayToken[index])}>
        <Td><Image width="48" height="48" src={`/tokenwhitelist/${arrayAllowToken[0][index]}.png`} alt='Shifumi' /></Td>
        <Td>{arrayAllowToken[0][index]}</Td>
        <Td isNumeric>{ethers.utils.formatEther(arrayAllowToken[1][index])}</Td>
        </Tr>
    );
    setListeAllowToken(tableallowtoken)
  }
  return (
    <>
    <TableContainer>
        <Table variant='simple'>
            <TableCaption>{isConnected ? (<Text>Select your coin</Text>) : (<Text>Please connect your wallet</Text>)}</TableCaption>
            <Thead>
            <Tr>
                <Th></Th>
                <Th>Coins</Th>
                <Th isNumeric>Your balance</Th>
            </Tr>
            </Thead>
            <Tbody>{allowtoken}</Tbody>
        </Table>
        </TableContainer>
    </>
  )
}

export default TokenAllow;
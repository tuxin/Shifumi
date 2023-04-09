import Image from 'next/image'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { useToast,Box,Center,Input,Button,TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Text} from '@chakra-ui/react'
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressStakingShifumi, abiStakingShifumi } from "../../public/contracts/ConstantsStakingShifumi.js"
import { abiERC20 } from "../../public/contracts/ConstantsERC20.js"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const ArrayStaking = () => {
  
  const { address, isConnected } = useAccount()
  const  provider  = useProvider()
  const { data: signer } = useSigner()
  const [balance, setBalance] = useState(null)
  const router = useRouter()
  const toast = useToast()
   

  useEffect(()=> {
      if(isConnected){
        getDatas()
      }
  },[address],[contractAddressStakingShifumi])

  const getDatas = async() => {
    const contractStaking = new ethers.Contract(contractAddressStakingShifumi,abiStakingShifumi,provider)
    const balancevalue = await contractStaking.getUserBalance(address)
    setBalance(ethers.utils.formatEther(balancevalue));
  }

  const setTheUnStack = async() => {
        try {
        const contractStaking = new ethers.Contract(contractAddressStakingShifumi, abiStakingShifumi, signer)
        const tokenamount = document.getElementById("inputvalueunstaking").value;
        const tokenAddressAmount = await contractStaking.getUserBalance(address)    
       
         if(ethers.utils.parseEther(tokenamount)>tokenAddressAmount){
            toast({
                title: 'Fail',
                description: "Incorrect amount",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
         }else{
            let transaction = await contractStaking.withdrawStaking(ethers.utils.parseEther(tokenamount))
            await transaction.wait()
            router.push('/staking')
            toast({
                title: 'Congratulations',
                description: "You withdraw your coin",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            getDatas()
         }   
       

    }
    catch(e) {
        console.log(e)
    }
}

  return (
    <>
    <TableContainer>
        <Table variant='simple'>
            <TableCaption>{isConnected ? (<Text>Your stake</Text>) : (<Text>Please connect your wallet</Text>)}</TableCaption>
            <Thead>
            <Tr>
                <Th></Th>
                <Th>Coins</Th>
                <Th isNumeric>Your balance</Th>
            </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td><Image width="48" height="48" src={`/tokenwhitelist/SHIFUMI.png`} alt='Shifumi' /></Td>
                    <Td>SHIFUMI</Td>
                    <Td id="balancestaking" isNumeric>{balance}</Td>
                </Tr>
            </Tbody>
        </Table>
        </TableContainer>
        <Box>
                    <Center>                  
                      <Input width="100%" placeholder='Amount' type='number' align="center" id="inputvalueunstaking"/>
                    </Center> 
                  </Box>
                  <br></br>
                  <Box>
                    <Center>
                    {isConnected ? (
                    <Button width="100%" colorScheme='red' id="buttonunstake" onClick={() => setTheUnStack()}>Unstake your coin</Button>
                    
                    ) : (
                      <Button width="100%" colorScheme='red'>Please connect your wallet</Button>
                    )} 
                    </Center> 
                  </Box>
    </>
  )
}

export default ArrayStaking;
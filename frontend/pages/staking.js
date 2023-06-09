import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'

import ArrayHistoryStaking from '@/components/ArrayHistoryStaking/ArrayHistoryStaking'
import ArrayStaking from '@/components/ArrayStaking/ArrayStaking'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Tfoot,SimpleGrid,CardFooter,VStack,InputLeftElement,show,FormLabel,InputGroup,inputEl,InputRightElement,loading     ,Select,NumberInput ,NumberInputField ,NumberInputStepper ,NumberIncrementStepper ,NumberDecrementStepper ,Center,RadioGroup ,Radio,useColorMode ,Button,Box,Spacer,Grid,HStack,Flex,Text,GridItem,LinkBox,Heading,LinkOverlay,Stat,StatGroup,StatLabel,StatNumber,StatHelpText,StatArrow,Card,CardHeader,CardBody,Stack,StackDivider } from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle, AlertDescription,useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { ConnectButton, getDefaultWallets } from '@rainbow-me/rainbowkit';
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressStakingShifumi, abiStakingShifumi } from "../public/contracts/ConstantsStakingShifumi.js"
import { abiERC20 } from "../public/contracts/ConstantsERC20.js"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function Staking() {
  

  const { data: signer } = useSigner()
  const { address, isConnected } = useAccount()
  const  provider  = useProvider()
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const toast = useToast()
  

    const setTheStack = async() => {
      try {
        const contractStaking = new ethers.Contract(contractAddressStakingShifumi, abiStakingShifumi, signer)
        const tokenamount = document.getElementById("inputvaluestaking").value;
        const tokenAddress = await contractStaking.getTokenAddress()

        const contractERC20 = new ethers.Contract(tokenAddress,abiERC20,signer)
        const allowancetoken = await contractERC20.allowance(address,contractAddressStakingShifumi)
       
        if(document.getElementById("inputvaluestaking").value>ethers.utils.formatEther(allowancetoken)){
          document.getElementById("buttonstake").innerHTML="Approve token before stake"
          let transaction = await contractERC20.approve(contractAddressStakingShifumi,ethers.utils.parseEther(tokenamount))
          await transaction.wait()

          document.getElementById("buttonstake").innerHTML="You can stake now"
        }else{
          let transaction = await contractStaking.addStaking(ethers.utils.parseEther(tokenamount))
          await transaction.wait()
          router.push('/staking')
          toast({
            title: 'Congratulations',
            description: "You send your coin to staking address",
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
          
        }
    }
    catch(e) {
        console.log(e)
    }
  }

  return (
    <>
      <Head>
        <title>Shifumi DApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <Grid 
        h='100%'
        width='100%'
        p="1rem"
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={3}
      >
        <GridItem rowSpan={2} colSpan={1}  >
        
        <Card alignItems="top"> 
          <Flex width="80%" justifyContent="space-between" alignItems="center">
                <Image width="1000" height="200" src='/logo.png' alt='Shifumi' />
               
            </Flex>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice">
                    Games
                  </Heading>
                  <br></br>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                     <a href="/shifumi">Shifumi (Soon)</a>
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                  <a href="/coinflip">Coin Flip</a>
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Roulette (Soon)
                  </Text>
                </Box>
                
              </Stack>
            </CardBody>
            </Card>
          <br></br>
          <Card alignItems="top">
            <CardBody >
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice">
                    Protocol
                  </Heading>
                  <br></br>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    <a href="/staking">Staking</a>
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                  Leadbord (Soon)
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Stats (Soon)
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <br></br>
          <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
        </GridItem>

      <GridItem colSpan={4} >

      <Grid 
        width='100%'
        
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={3}
      >
        <GridItem rowSpan={1} colSpan={4}  >
          <Card>
            <CardBody>
              
              
          <Grid templateColumns='repeat(5, 1fr)' gap={4}>
        <GridItem colSpan={2} >
          
            <Text></Text>
          
        </GridItem>
         <GridItem colStart={6} colEnd={6} align="right">
          <ConnectButton />
         </GridItem>
          </Grid>
            </CardBody>
          </Card>
        </GridItem>
        </Grid>
          <br></br>
      <Grid 
        width='100%'
        
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={3}
      >
        <GridItem rowSpan={1} colSpan={1}  >
          <Card>
            <CardBody>
              <HStack spacing='24px'>
                <Box >
                  <Image
                    borderRadius='full'
                    boxSize='64px'
                    src='/somme.png'
                    alt='Dan Abramov'
                    width="64"
                    height="64"
                  />
                </Box>
                <Box >
                  <Stat>
                    <StatLabel color="#aab4d3" fontFamily="alice">Bankroll</StatLabel>
                    <StatNumber  fontFamily="alice">345,670$</StatNumber>
                    <StatHelpText  fontFamily="alice">
                    <StatArrow type='increase' />3.36%</StatHelpText>
                  </Stat>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}  >
          <Card>
            <CardBody>
              <HStack spacing='24px'>
                <Box >
                  <Image
                    borderRadius='full'
                    boxSize='64px'
                    src='/players.png'
                    alt='Dan Abramov'
                    width="64"
                    height="64"
                  />
                </Box>
                <Box >
                  <Stat>
                    <StatLabel color="#aab4d3"  fontFamily="alice">Players</StatLabel>
                    <StatNumber  fontFamily="alice">105</StatNumber>
                    <StatHelpText  fontFamily="alice">
                    <StatArrow type='decrease' />1.05%</StatHelpText>
                  </Stat>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}  >
          <Card>
            <CardBody>
              <HStack spacing='24px'>
                <Box >
                  <Image
                    borderRadius='full'
                    boxSize='64px'
                    src='/played.png'
                    alt='Dan Abramov'
                    width="64"
                    height="64"
                  />
                </Box>
                <Box >
                  <Stat>
                    <StatLabel color="#aab4d3" font="alice">Games Played</StatLabel>
                    <StatNumber  fontFamily="alice">2390</StatNumber>
                    <StatHelpText  fontFamily="alice">
                    <StatArrow type='increase' />6.84%</StatHelpText>
                  </Stat>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}  >
          <Card>
            <CardBody>
              <HStack spacing='24px'>
                <Box >
                  <Image
                    borderRadius='full'
                    boxSize='64px'
                    src='/fees.png'
                    alt='Dan Abramov'
                    width="64"
                    height="64"
                  />
                </Box>
                <Box >
                  <Stat>
                    <StatLabel color="#aab4d3"  fontFamily="alice">Fees</StatLabel>
                    <StatNumber  fontFamily="alice">721$</StatNumber>
                    <StatHelpText  fontFamily="alice">
                    <StatArrow type='increase' />2.55%</StatHelpText>
                  </Stat>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </GridItem>
        </Grid>

          <br></br>
          <Grid 
        width='100%'
        
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={3}
      >
         <GridItem rowSpan={1} colSpan={3} >
         <Card height="100%">
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice"> 
                    Stake and Unstake
                  </Heading>
                  <br></br>
                </Box>
              
                <VStack
                  spacing={2}
                  align='stretch'
                >
                  
                  <Box>
                    <Center>
                      <Image width="128" height="128" src='/heads.png' alt='Shifumi' />
                    </Center>
                  </Box>
                  <Box>
                    <Center>                  
                      <Input width="30%" placeholder='Amount' type='number' align="center" id="inputvaluestaking"/>
                    </Center> 
                  </Box>
                  <Box>
                    <Center>
                    {isConnected ? (
                    <Button width="30%" colorScheme='red' id="buttonstake" onClick={() => setTheStack()}>Stake your coin</Button>
                    
                    ) : (
                      <Button width="30%" colorScheme='red'>Please connect your wallet</Button>
                    )} 
                    </Center> 
                  </Box>
                </VStack>
              </Stack>
            </CardBody>
          </Card>

         </GridItem>
         <GridItem rowSpan={1} colSpan={1} >
         <Card height="100%" >
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice"> 
                    CURRENT STAKING
                  </Heading>
                  <br></br>
                </Box>

               <ArrayStaking />
                
              </Stack>
            </CardBody>
          </Card>

         </GridItem>
      </Grid>
          
          <br></br>
          <ArrayHistoryStaking />
          
        </GridItem>
      </Grid>
      </Layout>
    </>
  )
}
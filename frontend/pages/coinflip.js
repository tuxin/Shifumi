import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import TokenAllow from '@/components/TokenAllow/TokenAllow'
import ArrayResults from '@/components/ArrayResults/ArrayResults'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Tfoot,SimpleGrid,CardFooter,VStack,InputLeftElement,show,FormLabel,InputGroup,inputEl,InputRightElement,loading     ,Select,NumberInput ,NumberInputField ,NumberInputStepper ,NumberIncrementStepper ,NumberDecrementStepper ,Center,RadioGroup ,Radio,useColorMode ,Button,Box,Spacer,Grid,HStack,Flex,Text,GridItem,LinkBox,Heading,LinkOverlay,Stat,StatGroup,StatLabel,StatNumber,StatHelpText,StatArrow,Card,CardHeader,CardBody,Stack,StackDivider } from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle, AlertDescription,} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { ConnectButton, getDefaultWallets } from '@rainbow-me/rainbowkit';
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressCoinFlip, abi } from "../public/contracts/ConstantsCoinFlip.js"
import { contractAddressBank, abiBank } from "../public/contracts/ConstantsBankShifumi.js"
import { abiERC20 } from "../public/contracts/ConstantsERC20.js"
import React, { useEffect, useState } from 'react';

export default function Home() {
  

  const { data: signer } = useSigner()
  const { address, isConnected } = useAccount()
  const  provider  = useProvider()
  const { colorMode, toggleColorMode } = useColorMode()
  const [multiplicator, setMultiplicator] = useState("null")
  const [imgSrc, setImgSrc] = useState("/heads.png");
  const [valueCoin, setValueCoin] = useState(1);
  const [textCoin, setTextCoin] = useState("Heads");
  
  const handleWinningAmountChange = async() => {

    if(document.getElementById("inputaddress").value!=ethers.constants.AddressZero){
      const contractERC20 = new ethers.Contract(document.getElementById("inputaddress").value,abiERC20,provider)
      const arrayAllowToken = await contractERC20.allowance(address,contractAddressBank)

      if(document.getElementById("inputvaluebet").value>ethers.utils.formatEther(arrayAllowToken)){
          document.getElementById("buttonconnect").innerHTML="Approve "+document.getElementById("inputaddressname").value
      }

      
    }
    
  };

  useEffect(()=> {
      if(isConnected){
        getDatas()
      }else{
        setMultiplicator(1.8)
      }
  },[address])

  const getDatas = async() => {
    const contractCoinFlip = new ethers.Contract(contractAddressCoinFlip,abi,provider)

    //Find the multiplicator
    let multiplicatorvalue = await contractCoinFlip.getMultiplicator([1])
    multiplicatorvalue= multiplicatorvalue/10
    setMultiplicator(multiplicatorvalue.toString())
  }

  const setTheCoin  = async() => {
    if(valueCoin==1){
      setValueCoin(2)
      setImgSrc("/tails.png")
      setTextCoin("Tails")
    }else{
      setValueCoin(1)
      setImgSrc("/heads.png")
      setTextCoin("Heads")
    }
    
  }

  const setTheBet = async() => {
    try {
        const contractBank = new ethers.Contract(contractAddressBank, abiBank, signer)
        const tokenamount = document.getElementById("inputvaluebet").value;

        if(document.getElementById("inputaddress").value==ethers.constants.AddressZero){
          let transaction = await contractBank.bet(contractAddressCoinFlip,document.getElementById("inputaddress").value,ethers.utils.parseEther(tokenamount),[valueCoin],{ value: ethers.utils.parseEther(tokenamount),gasLimit: 5000000 })
          await transaction.wait()
          //router.push('/coinflip')
        }else{
          const contractERC20 = new ethers.Contract(document.getElementById("inputaddress").value,abiERC20,provider)
          const arrayAllowToken = await contractERC20.allowance(address,contractAddressBank)

          
          
          if(document.getElementById("inputvaluebet").value>ethers.utils.formatEther(arrayAllowToken)){
            const contractERC20 = new ethers.Contract(document.getElementById("inputaddress").value,abiERC20,signer)
            let transaction = await contractERC20.approve(contractAddressBank,ethers.utils.parseEther(tokenamount))
            await transaction.wait()
            document.getElementById("buttonconnect").innerHTML="Heads to win "+document.getElementById("inputaddressname").value
          }else{
            let transaction = await contractBank.bet(contractAddressCoinFlip,document.getElementById("inputaddress").value,ethers.utils.parseEther(tokenamount),[valueCoin],{ gasLimit: 5000000 })
            console.log(await transaction.wait())
            router.push('/coinflip')
          }
          
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
                     <a href="/">Shifumi (Soon)</a>
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Coin Flip
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
                    Coin Flip
                  </Heading>
                  <br></br>
                </Box>
              
                <VStack
                  spacing={2}
                  align='stretch'
                >
                  
                  <Box>
                    <Center>
                      <Text fontSize="50" fontFamily="Archivo Black">X {multiplicator}</Text>
                    </Center>
                  </Box>
                  <Box>
                    <Center>
                      <Image width="128" height="128" src={imgSrc} id="coin" onClick={() => setTheCoin()} alt='Shifumi' />
                    </Center>
                  </Box>
                  <Box>
                    <Center>
                      <Text fontSize="20" fontFamily="Archivo Black">{textCoin}</Text>
                    </Center>
                  </Box>
                  <Box>
                    <Center>                  
                      <Input width="30%" placeholder='Amount' type='number' align="center" id="inputvaluebet" onChange={handleWinningAmountChange}/>
                    </Center> 
                  </Box>
                  <Box>
                    <Center>
                      <SimpleGrid fontSize="13" w="30%" columns={2} spacing={1}>
                      <Box>Payout: 3</Box>
                      <Box align="right" >3% fees = 0.03</Box>
                      <Box >Bankroll:  30994</Box>
                      <Box align="right">Max payout: 2000</Box>
                      </SimpleGrid>
                    </Center> 
                  </Box>
                  <Box>
                    <Center>
                    {isConnected ? (
                    <Button width="30%" colorScheme='red' id="buttonconnect" onClick={() => setTheBet()}>Select your coin</Button>
                    
                  ) : (
                    <Button width="30%" colorScheme='red'>Please connect your wallet</Button>
                  )}
                      <Input type="hidden" id="inputaddress" />
                      <Input type="hidden" id="inputaddressname" />
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
                    BET COINS
                  </Heading>
                  <br></br>
                </Box>

               <TokenAllow />
                
              </Stack>
            </CardBody>
          </Card>

         </GridItem>
      </Grid>
          
          <br></br>
          <ArrayResults />
          
        </GridItem>
      </Grid>
      </Layout>
    </>
  )
}
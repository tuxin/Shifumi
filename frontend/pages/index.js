import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { SimpleGrid,CardFooter,VStack,InputLeftElement,show,FormLabel,InputGroup,inputEl,InputRightElement,loading     ,Select,NumberInput ,NumberInputField ,NumberInputStepper ,NumberIncrementStepper ,NumberDecrementStepper ,Center,RadioGroup ,Radio,useColorMode ,Button,Box,Spacer,Grid,HStack,Flex,Text,GridItem,LinkBox,Heading,LinkOverlay,Stat,StatGroup,StatLabel,StatNumber,StatHelpText,StatArrow,Card,CardHeader,CardBody,Stack,StackDivider } from '@chakra-ui/react'
import { Alert, AlertIcon, AlertTitle, AlertDescription,} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import "@fontsource/cinzel-decorative"
import "@fontsource/alice"
import React, { useState } from 'react';

export default function Home() {

  const { address, isConnected } = useAccount()
  const { colorMode, toggleColorMode } = useColorMode()
  const [winningAmoutMessage, setWinningAmount] = useState("1 x 1,97 = 1,97");

  const handleWinningAmountChange  = (event) => {
    setWinningAmount(event.target.value);
  };

  
 

  return (
    <>
      <Head>
        <title>Shifumi DApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout >
      <Grid 
        h='100%'
        width='100%'
        p="1rem"
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={3}
        backgroundColor="#f5f8fe"
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
                    Shifumi
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Coin Flip
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Roulette
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
                    Leadbord
                  </Text>
                </Box>
                <Box>
                  <Text pt='1' fontSize='sm' fontFamily="alice">
                    Stats
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
              Barre de connexion et autre
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
          <Card >
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
                    
                  <HStack spacing='24px' >
                  <Box  w='60%' align="right">
                  <Text fontSize='50px' color="#FFD700"  fontFamily="alice">{winningAmoutMessage}</Text>
                  </Box>
                  <Box w='50%'  >
                  <Image width="128" height="128" src='/matic.png' alt='Shifumi' />
                  </Box>

                </HStack>
 
  

  
    

                      
                    
                  </Box>
                  <Box>
                    <Center>
                      <Image width="128" height="128" src='/heads.png' alt='Shifumi' />
                    </Center>
                  </Box>
                  <Box>
                    <Center>
                      <Input width="20%" type='number' align="right" onChange={handleWinningAmountChange}/>
                    </Center> 
                  </Box>
                  <Box>
                    <Center>
                      <Text fontSize='10px' color='black'  fontFamily="alice">3% fees - Bankroll 30994 - Max payout 2000</Text>
                    </Center>
                  </Box>
                  <Box>
                    <Center>
                      <Button width="20%" colorScheme='blue'>Heads to win matic</Button>
                    </Center> 
                  </Box>
                </VStack>

                

                
                          
                  
                  


                
              </Stack>
            </CardBody>
          </Card>
          <br></br>
          <Card >
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice"> 
                    Results
                  </Heading>
                  <br></br>
                </Box>
                <Center h='100px' color='white'>
                <RadioGroup defaultValue='2'>
                      <Stack spacing={5} direction='row'>
                        <Radio colorScheme='red' value='1' color="black">
                        <Text fontSize='md' fontFamily="alice" color="black">Heads</Text>
                        </Radio>
                        <Radio colorScheme='green' value='2'>
                        <Text fontSize='md' fontFamily="alice" color="black">Tails</Text>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                </Center>
              </Stack>
            </CardBody>
          </Card>

        </GridItem>
      </Grid>
      </Layout>
    </>
  )
}
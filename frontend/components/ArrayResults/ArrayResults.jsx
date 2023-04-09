import Image from 'next/image'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { CircularProgress,TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Card,CardBody,Stack,StackDivider,Box,Heading,Center,Tfoot } from '@chakra-ui/react'
import { CheckIcon, CloseIcon,RepeatIcon } from '@chakra-ui/icons'
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressBank, abiBank } from "../../public/contracts/ConstantsBankShifumi.js"
import React, { useEffect, useState } from 'react';

const ArrayResults = () => {

    const [inprogressbet, setInprogressbet] = useState(null)
    const [donebet, setDonebet] = useState(null)
    const { address, isConnected } = useAccount()
    const  provider  = useProvider()
    const contractev = new ethers.Contract(contractAddressBank, abiBank, provider);
    /*contractev.on("TestDD", (_id,_gameName,_account,_amount,_numbers,_multiplier,_nameToken,_timestamp,event)=>{
        let transferEvent ={
            eventData: event,
        }

        let choice=''
        if(_numbers[0]==1){
            choice="Heads"
        }else{
            choice="Tails"
        }

        const tableinprogress= (() =>   
            <Tr bg="cyan">
                <Td><CircularProgress isIndeterminate color='green.300' size='20px'/></Td>
                <Td>#{_id.toNumber()}</Td>
                <Td>{_gameName}</Td>
                <Td isNumeric>{_amount.toNumber()}</Td>
                <Td isNumeric>{_multiplier.toNumber()/10}</Td>
                <Td>{choice}</Td>
                <Td>Wait</Td>
                <Td isNumeric>{_amount.toNumber()*_multiplier.toNumber()/10}</Td>
                <Td><Image width="36" height="36" src={`/tokenwhitelist/${_nameToken}.png`} alt='Shifumi' /></Td>
                <Td isNumeric>{(_amount.toNumber()*_multiplier.toNumber()/10/100*3).toFixed(2)}</Td>
                <Td>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(_timestamp*1000)}</Td>
            </Tr>
        );
        //setInprogressbet(tableinprogress)
    })
    */

    function choiceConvert(game,value){
        if(game=="CoinFlip"){
            if(value==1){
                return "Heads"
            }  
            return "Tails" 
        }
        return value
    }

    //event ResultBet(uint _id,string _gameName,address _account,uint256 _amount,uint8[] _numbers,uint _multiplier,string _nameToken,uint _timestamp,string _result,uint256 _randomnumber,uint256 _winningamount);
    const getEvents = async() => {
        const events = await contractev.queryFilter('ResultBet',34161296);
        
        const listItems = events.map((number) =>
                <Tr>
                <Td></Td>
                <Td>{(number.args[0]).toNumber()}</Td>
                <Td>{number.args[1]}</Td>
                <Td isNumeric>{ethers.utils.formatEther(number.args[3])}</Td>
                <Td isNumeric>{(number.args[5]).toNumber()/10}</Td>
                <Td>{choiceConvert(number.args[1],number.args[4][0])}</Td>
                <Td>{number.args[8]}</Td>
                <Td isNumeric>{ethers.utils.formatEther(number.args[10])}</Td>
                <Td><Image width="48" height="48" src={`/tokenwhitelist/${number.args[6]}.png`} alt='Shifumi' /></Td>
                <Td isNumeric>{ethers.utils.formatEther((number.args[3]/100*3).toString())}</Td>
                <Td>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(number.args[7]*1000)}</Td>
            </Tr>
        ).reverse();
        setDonebet(listItems)
    }
    if(isConnected){
        getEvents()
    }
  return (
    <>
    <Card >
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice"> 
                    Results
                  </Heading>
                  <br></br>
                </Box>
                <Center color='black'>
                <TableContainer width="100%">
                    <Table variant='simple' >
                        <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Id</Th>
                            <Th>Games</Th>
                            <Th isNumeric>Bet</Th>
                            <Th isNumeric>Multiplier</Th>
                            <Th>Choice</Th>
                            <Th>Result</Th>
                            <Th isNumeric>Payout</Th>
                            <Th>Coins</Th>
                            <Th isNumeric>Protocol fees</Th>
                            <Th>Date</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {inprogressbet}
                            {donebet}
                        </Tbody>
                        <Tfoot>
                        <Tr>
                            <Th></Th>
                            <Th>Id</Th>
                            <Th>Games</Th>
                            <Th isNumeric>Bet</Th>
                            <Th isNumeric>Multiplier</Th>
                            <Th>Choice</Th>
                            <Th>Result</Th>
                            <Th isNumeric>Payout</Th>
                            <Th>Coins</Th>
                            <Th isNumeric>Protocol fees</Th>
                            <Th>Date</Th>
                        </Tr>
                        </Tfoot>
                    </Table>
                    </TableContainer>
                </Center>
              </Stack>
            </CardBody>
          </Card>
    </>
  )
}

export default ArrayResults;
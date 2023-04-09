import Image from 'next/image'
import { useAccount, useProvider, useSigner ,useContractEvent} from 'wagmi'
import { TableContainer ,Table ,TableCaption ,Thead ,Tr ,Th,Tbody,Td,Card,CardBody,Stack,StackDivider,Box,Heading,Center,Tfoot } from '@chakra-ui/react'
import { CheckIcon, CloseIcon,RepeatIcon } from '@chakra-ui/icons'
import "@fontsource/cinzel-decorative"
import "@fontsource/archivo-black"
import { ethers } from 'ethers'
import { contractAddressStakingShifumi, abiStakingShifumi } from "../../public/contracts/ConstantsStakingShifumi.js"
import React, { useEffect, useState } from 'react';



const ArrayStaking = () => {

    const [inprogressbet, setInprogressbet] = useState(null)
    const [donebet, setDonebet] = useState(null)

   
  
    const  provider  = useProvider()
   
    const contractev = new ethers.Contract(contractAddressStakingShifumi, abiStakingShifumi, provider);
    //contractev.on("Staking", (_type,_address,_amount,_timestamp,event)=>{
      //  const tableinprogress= (() =>

        //    <Tr>
        //        <Td>{_type}</Td>
        //        <Td>{_address}</Td>
         //       <Td>{ethers.utils.formatEther(_amount)}</Td>
         //       <Td>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(_timestamp*1000)}</Td>
         //   </Tr>
       // );
       // setInprogressbet(tableinprogress)
    //})

   
    const getEvents = async() => {
        const events = await contractev.queryFilter('Staking',34161296);
        const listItems = events.map((number) =>
                <Tr>
                <Td>{number.args[0]}</Td>
                <Td>{number.args[1]}</Td>
                <Td>{ethers.utils.formatEther(number.args[2])}</Td>
                <Td>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(number.args[3]*1000)}</Td>
                </Tr>
        ).reverse();
        setDonebet(listItems)
    }
    getEvents()

  return (
    <>
    <Card >
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                <Heading size='md' textTransform='uppercase' fontFamily="alice"> 
                    History
                  </Heading>
                  <br></br>
                </Box>
                <Center color='black'>
                <TableContainer width="100%">
                    <Table variant='simple' >
                        <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Address</Th>
                            <Th >Amount</Th>
                            <Th>Date</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {inprogressbet}
                            {donebet}
                        </Tbody>
                        <Tfoot>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Address</Th>
                            <Th >Amount</Th>
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

export default ArrayStaking;
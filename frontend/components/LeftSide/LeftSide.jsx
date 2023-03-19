import { Flex, Text } from '@chakra-ui/react';

const LeftSide = () => {
    return (
        <Flex justifyContent="center" alignItems="center" width="10%%" height="10vh" p="2rem">
            <Text>&copy; Shifumi {new Date().getFullYear()}</Text>
        </Flex>
    )   
}

export default LeftSide;
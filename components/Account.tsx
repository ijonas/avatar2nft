import { Image, Link, HStack, Text, VStack, Button, Heading} from '@chakra-ui/react'
import { useNetwork } from 'wagmi'
import NetworkSwitch from './NetworkSwitch'

const shortAddress = (address: string): string => `${address.substring(0, 4)}...${address.substring(address.length-4)}`

const Account = ({accountData, disconnect}: any) => {
  const [networkData, switchNetwork] = useNetwork()

  return (      
    <HStack>
      <Heading>avatar2nft</Heading>
        <Text>|</Text>        

      { accountData?.ens?.avatar && <Image src={accountData?.ens?.avatar} alt="ENS Avatar" boxSize='50px' objectFit='cover' borderRadius='full'/>}
      <VStack>
        <Text>
          {accountData.ens?.name
            ? `${accountData.ens?.name} (${shortAddress(accountData.address)})`
            : shortAddress(accountData.address)}
        </Text>
        <Text fontSize='xs'>Connected to &nbsp; 
        {networkData?.data.chain?.name ?? networkData?.data.chain?.id}{' '}
        {networkData?.data.chain?.unsupported && '(unsupported)'}
        </Text>

        {/* <NetworkSwitch></NetworkSwitch> */}

      </VStack>
      <Button color='teal' href='#' onClick={disconnect}>Disconnect</Button>

    </HStack>
  )
}

export default Account

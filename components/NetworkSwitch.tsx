import { Button, Select, Text, VStack } from '@chakra-ui/react'
import { ChangeEventHandler } from 'react'
import { useNetwork } from 'wagmi'



const NetworkSwitch = () => {
  const [networkData, switchNetwork] = useNetwork()

  const switchTo = (event: any) => {
    const chainId = event?.target?.value;
    if (chainId && switchNetwork) {
      switchNetwork(parseInt(chainId,10))
    }
  }
  

  console.log({networkData})
  return (
    <VStack>
      <Text>to&nbsp; 
        {networkData?.data.chain?.name ?? networkData?.data.chain?.id}{' '}
        {networkData?.data.chain?.unsupported && '(unsupported)'}
      </Text>

      <Select onChange={switchTo}>
        {switchNetwork &&
          networkData?.data.chains.map((chain) =>
            chain.id === networkData?.data.chain?.id ? null : (
              <option key={chain.id} onClick={() => switchTo(chain.id)} value={chain.id}>
                Switch to {chain.name}
              </option>
            ),
          )}
      </Select>

      {networkData?.error && <div>{networkData?.error?.message}</div>}
    </VStack>
  )
}

export default NetworkSwitch;
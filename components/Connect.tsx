import { Button, Heading, HStack, Text } from "@chakra-ui/react";
import { disconnect } from "process";
import React from "react";
import { useConnect } from "wagmi";

export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

const Connect = () => {
  const isMounted = useIsMounted();
  const [connectData, connect] = useConnect()

  const isConnected:boolean = !connectData.data.connected;

  if (isConnected) {
    return (
      <HStack>
        <Heading>avatar2nft</Heading>
        <Text>|</Text>
        <Text>Connect</Text>
        {
connectData.data.connectors.map((connector) => (
  <Button
    disabled={isMounted ? !connector.ready : false}
    key={connector.id}
    onClick={() => connect(connector)}
  >
    {isMounted ? connector.name : connector.id === 'injected' ? connector.id : connector.name}
    {isMounted ? !connector.ready && ' (unsupported)' : ''}
  </Button>
))          
        }
      </HStack>

      )
  }
  return undefined;
}

export default Connect
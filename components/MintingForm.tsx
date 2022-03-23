import {  Button, Text, VStack, Image, Heading, Link } from '@chakra-ui/react'
import { useAccount, useConnect, useContractWrite } from "wagmi";
import React, { useState } from "react";

const avatarABI = require('../Avatar.abi.json');

const MintingForm = ({metadataURI, storedImageURL, onSubmit, imageName}:any) => {
  const [accountData, disconnect] = useAccount({fetchEns: true});
  const [connectData, connect] = useConnect()
  const [minting, setMinting] = useState(false);
  const [mintingError, setMintingError] = useState("");
  const [txHash, setTxHash] = useState("");

  const  [{ data, error, loading: waitForSignature }, awardItem]  = useContractWrite(
    {
      addressOrName: '0x8A5793cA87912E42DE7EFbe664059e5E27aE65F2',
      contractInterface: avatarABI,
    },
    "awardItem"
  )

  const explorerUrl = (txHash: string) => `https://rinkeby.etherscan.io/tx/${txHash}`

  const mint = () => {
    if (awardItem && accountData.data) {
      setMinting(true);
      setMintingError("");
      awardItem({args: [accountData.data?.address, metadataURI]}).then(({data, error}: any) => {
        if (error) {
          setMintingError(error.message);
        } else {
          setTxHash(data.hash);
        }
        setMinting(false);
      })

    }
  }


  return (

        <VStack>
            <Heading>{imageName}</Heading>
            <Image src={storedImageURL} alt={imageName} boxSize='300px' objectFit="cover"></Image>

            { !connectData?.data?.connected
              ? <Text>Please connect to your wallet using the buttons at the top of the screen.</Text>
              : <Text>&nbsp;</Text>
            }
            { minting 
              ? (<Button colorScheme='teal' size='md' disabled>Minting...</Button>)
              : txHash.length > 0 
              ? (<Button colorScheme='teal' size='md' disabled={true} onClick={mint}>Minted</Button>)
              : (<Button colorScheme='teal' size='md' disabled={!connectData?.data?.connected} onClick={mint}>Mint</Button>)
            }
            {mintingError.length>0 && <Text>{mintingError}</Text>}
            {txHash.length>0 && <Text>Follow transaction on <Link color='teal' href={explorerUrl(txHash)}>Etherscan</Link></Text>}
            {txHash.length>0 && <Text>Visit your profile on <Link color='teal' href="https://testnets.opensea.io/account">Open Sea</Link></Text>}
            {txHash.length>0 && <Text><Link color='teal' href="/">Start Again...</Link></Text>}

        </VStack>
          

          
  )
}

export default MintingForm

import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import axios from 'axios';

import { Heading, Text, Grid, GridItem, Link, Flex, Box, HStack, Spacer } from '@chakra-ui/react'
import { useState } from 'react'
import FileUploadForm from '../components/FileUploadForm';
import MintingForm from '../components/MintingForm';
import Account from '../components/Account';
import { useAccount } from 'wagmi';
import Connect from '../components/Connect';

const extractURI = (url: string): string | undefined => {
  const match = url.match(/^ipfs:\/\/(.*)$/)
  if (match) {
    return match[1]
  }
}

const ipfsURL = (uri: string) => `https://ipfs.io/ipfs/${uri}`;

const Home: NextPage = () => {
  const [uploading, setUploading] = useState(false);
  const [finishedUpload, setFinishedUpload] = useState(false);
  const [metadataURI, setMetadataURI] = useState(undefined);
  const [storedImageURL, setStoredImageURL] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [imageName, setImageName] = useState("");

  const onSubmit = ({name, description, external_url, file}: any) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('external_url', external_url);
    formData.append('file', file[0]);
    axios.post('/api/upload_nft', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
      setUploading(false);
      setMetadataURI(res.data.metadata.url)
      const uri = extractURI(res.data.metadata.url)
      if (uri) {
        axios.get(ipfsURL(uri)).then(metadata => {
          const imageURI = extractURI(metadata.data.image)
          if (imageURI) {
            const imageURL = ipfsURL(imageURI);

            setStoredImageURL(imageURL);
            setImageName(name);
            setFinishedUpload(true);
          } else {
            setUploadError(`Unable to determine the newly created image location. ${imageURI}`)
          }
        })
      } else {
        setUploadError(`Unable to determine the newly created metadata location. ${uri}`)
      }
    }).catch(err => {
      setUploadError(`Unable to upload file & metadata. ${err.message}`)
    })
  }

  const [accountData, disconnect] = useAccount({fetchEns: true});

  
  return (
    <Flex direction="column">
      <HStack padding={5}>
        
        { accountData.data 
          ? <Account disconnect={disconnect} accountData={accountData.data}></Account>
          : <Connect></Connect>
        }
        <Spacer/>
      </HStack>
      <main className={styles.main}>
        <Grid>
          <GridItem>
            { finishedUpload 
              ? (<MintingForm 
                  imageName={imageName}
                  storedImageURL={storedImageURL} 
                  metadataURI={metadataURI}>                    
                  </MintingForm>)
              : (<FileUploadForm 
                  name="Ijonas"
                  description="Portrait of Ijonas K." 
                  externalURL="https://ijonas.com"
                  onSubmit={onSubmit} 
                  uploading={uploading}
                  uploadError={uploadError}>            
                </FileUploadForm>)
            }
                        
          </GridItem>
        </Grid>
      </main>

      <footer className={styles.footer}>
        <Link
          href="https://ijonas.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; Ijonas Kisselbach
        </Link>
      </footer>


    </Flex>



  )
}

export default Home

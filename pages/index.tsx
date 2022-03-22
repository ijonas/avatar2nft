import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import FileUpload from '../components/FileUpload'
import styles from '../styles/Home.module.css'
import { useForm } from "react-hook-form";
import axios from 'axios';

import { Stack, HStack, VStack, Heading, FormControl, FormHelperText, FormLabel, Input, Textarea, Text, FormErrorMessage, Button, Container, Grid, GridItem } from '@chakra-ui/react'
import { useState } from 'react'

const defaultMetadata = {
	"description": "Portrait of Ijonas K.",
	"external_url": "https://ijonas.com",
	"image": null,
	"name": "Ijonas",
	"attributes": [{
		"trait_type": "Colour",
		"value": "black and white"
	}, {
		"trait_type": "Pronouns",
		"value": "he/him"
	}]
}

const Home: NextPage = () => {
  const [uploading, setUploading] = useState(false);
  const [metadataURI, setMetadataURI] = useState(undefined);
  const { handleSubmit, register, formState: { errors } } = useForm();
  const onSubmit = ({name, description, external_url, file}: any) => {
    console.log({name, description, external_url, file});
    setUploading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('external_url', external_url);
    formData.append('file', file[0]);
    axios.post('/api/upload_nft', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
      console.log("Uploaded")
      console.log(res.data)
      setUploading(false);
      setMetadataURI(res.data.metadata.url)
    })
  }


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Grid>
          <GridItem>

          <Heading paddingBottom={5}>avatar2nft</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='name'>Name</FormLabel>
              <Input defaultValue={defaultMetadata.name} id="name" placeholder='Jane Doe' {...register("name", {required: "Name is required"})}/>
              {errors.name && errors.name.message ? (
                  <FormErrorMessage>{ errors.name.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Enter your name</FormHelperText>
                )
              }
            </FormControl>

            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <Input defaultValue={defaultMetadata.description} id="description" placeholder='Its a photo of me.' {...register("description")}/>
              {errors.description && errors.description.message ? (
                  <FormErrorMessage>{ errors.description.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Describe your avatar</FormHelperText>
                )
              }
            </FormControl>

            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='external_url'>External URL</FormLabel>
              <Input defaultValue={defaultMetadata.external_url} id="external_url" placeholder='https://johndoe.acme.local' {...register("external_url")}/>
              {errors.external_url && errors.external_url.message ? (
                  <FormErrorMessage>{ errors.external_url.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>A website to refer people to.</FormHelperText>
                )
              }
            </FormControl>

            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='file'>Avatar</FormLabel>
              <input type="file" id="file" {...register("file", {required: "A file is required"})}></input>
              {errors.file && errors.file.message ? (
                  <FormErrorMessage>{ errors.file.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Please only use the common formats like JPG, GIF, or PNG.</FormHelperText>
                )
              }              
            </FormControl>
            { uploading 
              ? (<Button colorScheme='teal' size='md' type='submit' disabled>Uploading...</Button>)
              : (<Button colorScheme='teal' size='md' type='submit'>Upload</Button>)
            }
          </form>
          <Text>{metadataURI}</Text>



          </GridItem>

        </Grid>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://ijonas.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy; Ijonas Kisselbach
        </a>
      </footer>
    </div>
  )
}

export default Home

import { useForm } from "react-hook-form";

import { FormControl, FormHelperText, FormLabel, Input, FormErrorMessage, Button, Text } from '@chakra-ui/react'

const FileUploadForm = ({name, description, externalURL, onSubmit, uploading, uploadError}:any) => {
  const { handleSubmit, register, formState: { errors } } = useForm();

  return (

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='name'>Name</FormLabel>
              <Input defaultValue={name} id="name" placeholder='Jane Doe' {...register("name", {required: "Name is required"})}/>
              {errors.name && errors.name.message ? (
                  <FormErrorMessage>{ errors.name.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Enter your name</FormHelperText>
                )
              }
            </FormControl>

            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <Input defaultValue={description} id="description" placeholder='Its a photo of me.' {...register("description")}/>
              {errors.description && errors.description.message ? (
                  <FormErrorMessage>{ errors.description.message}</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Describe your avatar</FormHelperText>
                )
              }
            </FormControl>

            <FormControl paddingBottom={5}>
              <FormLabel htmlFor='external_url'>External URL</FormLabel>
              <Input defaultValue={externalURL} id="external_url" placeholder='https://janedoe.acme.local' {...register("external_url")}/>
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
                  <FormErrorMessage>{ errors.file.message }</FormErrorMessage>
                ) : (                  
                  <FormHelperText>Please only use the common formats like JPG, GIF, or PNG.</FormHelperText>
                )
              }              
            </FormControl>
            { uploading 
              ? (<Button colorScheme='teal' size='md' type='submit' disabled>Uploading...</Button>)
              : (<Button colorScheme='teal' size='md' type='submit'>Upload</Button>)
            }
            <Text color='red'>{uploadError}</Text>
          </form>
          
  )
}

export default FileUploadForm

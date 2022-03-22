// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from "fs";
import { NFTStorage, File } from 'nft.storage'


const parseForm = (req: NextApiRequest) => new Promise((resolve, reject) => {
  const form = formidable({});

  form.parse(req, (err: any, fields :any, files: any) => {
    console.log("parsed")
    if (err) reject(err);
    console.log("noerror")
    resolve({fields, files})
  })  
})

const storeFile = async (name: string, description: string, external_url: string, file: any) => {
  const token = process.env.NFT_STORAGE_API_TOKEN;
  if (!token) throw new Error("Please set the NFT_STORAGE_API_TOKEN envvar")
  console.log({file})
  console.log({token})
  const client = new NFTStorage({ token })
  const image = new File([await fs.promises.readFile(file.filepath)], file.originalFilename, {type: file.mimeType})
  console.log({newFile: image})
  const metadata = await client.store({ name, description, external_url, image})
  console.log(metadata)
  return metadata
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("/upload_nft received received.")
  return parseForm(req).then(({fields, files}: any) => {
    console.log({fields, files})

    return storeFile(fields.name[0], fields.description[0], fields.external_url[0], files.file[0])
    .then(metadata => {
      res.status(200).json({message: "OK", metadata} as any);
    })
    .catch(err => {
      res.status(500).json({message: err.message} as any)  
    })


    
  }).catch(err => {
    res.status(500).json({message: err.message} as any)
  })
}

export const config = {
  api: {
    bodyParser: false
  }
}

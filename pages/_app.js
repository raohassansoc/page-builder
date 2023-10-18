import '@/styles/globals.css'
import { useState } from 'react';
import { Web3Storage, File } from 'web3.storage';
import axios from 'axios';


export default function App({ Component, pageProps }) {
  const [uploading, setUploading] = useState(false);
  // async function getFileList(directory) {
  //   const fs = require('fs');
  //   const util = require('util');
  //   const readdir = util.promisify(fs.readdir);
  //   const stat = util.promisify(fs.stat);

  //   async function getFilesRecursively(dir) {
  //     const files = [];
  //     const entries = await readdir(dir);

  //     for (const entry of entries) {
  //       const entryPath = `${dir}/${entry}`;
  //       const entryStat = await stat(entryPath);

  //       if (entryStat.isDirectory()) {
  //         const nestedFiles = await getFilesRecursively(entryPath);
  //         files.push(...nestedFiles);
  //       } else {
  //         files.push(new File([fs.readFileSync(entryPath)], { path: entryPath.replace(directory, '') }));
  //       }
  //     }

  //     return files;
  //   }

  //   return getFilesRecursively(directory);
  // }

  const handleUpload = async () => {
    setUploading(true);

    // Create a new Web3Storage client with your API key
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzNjgwREU5MDNBRUIxMjc2NEZGRDJhOWNDRUFDNTNFYjdkMzVkQkIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQ1MzA5NTA3NzQsIm5hbWUiOiJidWlsZGVyIn0.4B_Mvq1WvDruzbxzU37gHS4cfKG6DVsp4dDkdo495eA'; // Replace with your API key
    const client = new Web3Storage({ token: apiKey });

    // Replace this with the actual path to your Next.js build folder
    const buildPath = './out'; // Adjust this as needed

    try {
      // Read the files from your build folder
      // const files = await getFileList(buildPath);
      console.log("Rao Hassan now")
      const files = await axios.get("/api/get-file/route")

      console.log("My object ==> ", files)


      // Upload the files to Web3.storage
      // const { cid } = await client.put(files);
      // console.log(`Uploaded to IPFS with CID: ${cid}`);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
    } finally {
      setUploading(false);
    }
  };

  return <>
    <button onClick={handleUpload}>Button</button>
    <Component {...pageProps} /></>
}

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
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzNjgwREU5MDNBRUIxMjc2NEZGRDJhOWNDRUFDNTNFYjdkMzVkQkIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQ1MzA5NTA3NzQsIm5hbWUiOiJidWlsZGVyIn0.4B_Mvq1WvDruzbxzU37gHS4cfKG6DVsp4dDkdo495eA'; // Replace with your API key
  const client = new Web3Storage({ token: apiKey });

  const handleUploads = async () => {
    setUploading(true);

    // Create a new Web3Storage client with your API key


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

  async function getFilesFromDirectory(inputElement) {
    const filesList = [];
    const items = inputElement.files;


    for (let i = 0; i < items.length; i++) {
      const file = items[i];
      filesList.push(file);
    }


    return filesList;
  }


  const uploadNextBuild = async (folder) => {
    console.log("folder ==> ", folder)
    // Assuming you have an input with webkitdirectory for users to select the build folder
    const inputElement = document.getElementById('inp');
    const allFiles = await getFilesFromDirectory(folder);


    if (allFiles.length === 0) return;


    try {
      console.log('Uploading Next.js build ...');


      // This assumes client.put() accepts an array of File objects for folders.
      // Depending on the library/client you are using, this could vary.
      const cid = await client.put(allFiles);


      console.log('Next.js build uploaded');


      const url = `https://${cid}.ipfs.w3s.link/`;
      // Do what you need with the URL
    } catch (error) {
      console.error(error);
    }
  }
  // /////////////////////////////////////////////////////////////////////////////////////////////////////////



  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleFolderChange = (event) => {
    const folder = event.target.files[0];
    setSelectedFolder(folder);
  };

  const handleUpload = async () => {
    if (!selectedFolder) {
      alert('Please select a folder to upload.');
      return;
    }

    // const folder = await axios.post("/api/upload/upload", )
    // console.log("My Folder Response ===> ",folder )
    // You can handle the folder upload logic here
    // For example, you can use the selectedFolder variable to access the folder's data.
    console.log("my folder ==> ", selectedFolder)
    alert('Folder selected for upload.');
  };


  const [buildOutput, setBuildOutput] = useState('');

  const runBuildCommand = async () => {
    try {
      const response = await fetch('/api/build/build');
      const data = await response.json();
      if (data.success) {
        setBuildOutput(data.stdout);
      } else {
        setBuildOutput(`Error: ${data.error}`);
      }
    } catch (error) {
      setBuildOutput(`Error: ${error.message}`);
    }
  };

  return <>
    <a href="/api/download/download">Download .next folder</a>
    {/* <button onClick={runBuildCommand}>Run npm run build</button> */}
    <pre>{buildOutput}</pre>
    <div>
      <input
        type="file"
        webkitdirectory="true"
        mozdirectory="true"
        directory="true"
        onChange={handleFolderChange}
        multiple="true"
      // style={{ display: 'none' }}
      />
      <label htmlFor="folderInput" style={{ cursor: 'pointer' }}>
        Select a folder
      </label>
      <button onClick={handleUpload}>Upload Folder</button>
    </div>

    {/* <input type='file' webkitdirectory id='inp' onChange={(e) => uploadNextBuild(e.target.value)} /> */}
    {/* <button onClick={uploadNextBuild}>check </button> */}
    <button onClick={handleUploads}>Button</button>
    <Component {...pageProps} /></>
}

import '@/styles/globals.css'
import { useEffect, useState } from 'react';
import { Web3Storage, File } from 'web3.storage';
import axios from 'axios';


export default function App({ Component, pageProps }) {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzNjgwREU5MDNBRUIxMjc2NEZGRDJhOWNDRUFDNTNFYjdkMzVkQkIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQ1MzA5NTA3NzQsIm5hbWUiOiJidWlsZGVyIn0.4B_Mvq1WvDruzbxzU37gHS4cfKG6DVsp4dDkdo495eA'; // Replace with your API key
  const client = new Web3Storage({ token: apiKey });

  const [selectedFolder, setSelectedFolder] = useState();

  useEffect(() => { }, [])

  const handleFolderChange = (event) => {
    const folder = event.target.files;
    setSelectedFolder(folder);
  };

  const handleUpload = async () => {
    if (!selectedFolder) {
      alert('Please select a folder to upload.');
      return;
    }


    // You can handle the folder upload logic here
    // For example, you can use the selectedFolder variable to access the folder's data.
    console.log("my folder ==> ", selectedFolder)
    alert('Folder selected for upload.');
  };

  async function prepareFilesFromInput() {
    const filesArray = Array.from(selectedFolder);
    return filesArray.map(file => {
      const filePath = file.webkitRelativePath || file.name;
      // console.log("file path", filePath)
      let newpath = filePath.replace("out/", "")
      // console.log("my new path ",newpath )
      return new File([file], newpath, { type: file.type });
    });
  }

  async function run() {
    const folderForIPFS = await prepareFilesFromInput();
    console.log(folderForIPFS)
    // return
    console.log("my Response ===> ", folderForIPFS)
    console.log("Is Running")
    const cid = await client.put(folderForIPFS);
    console.log(`Uploaded to IPFS with CID: https://${cid}.ipfs.w3s.link`);


    const res = await client.get(cid);
    console.log("response == > ", res)

    // const filename = 'baby...dfny'; // replace this with the actual filename
    // const content = await client.get(cid,filename);
    // console.log("What", content);
  }

  async function createBuild() {
    const build = await axios.get("/api/build/build")
    console.log("my build ===> ", build)
  }


  return <>
    <div>
      <input
        type="file"
        webkitdirectory="true"
        mozdirectory="true"
        directory="true"
        onChange={handleFolderChange}
        multiple="true"
      />
      <button onClick={run} style={{
        display: "inline-block",
        backgroundColor: "#0047FF",
        color: "white",
        padding: "5px 24px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: 600,
        textAlign: "center",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        marginRight: "15px"
      }}>Click</button>
      <a href="/api/download/download">Download .next folder</a>
      <button onClick={createBuild} style={{
        display: "inline-block",
        backgroundColor: "#0047FF",
        color: "white",
        padding: "5px 24px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: 600,
        textAlign: "center",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        marginLeft: "5px",
        marginRight: "15px"
      }}>Create Build</button>
      {/* <button onClick={handleUpload}>Upload Folder</button> */}
    </div>

    <Component {...pageProps} /></>
}

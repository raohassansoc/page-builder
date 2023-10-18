
import { File, Web3Storage } from 'web3.storage';
import { Readable } from 'stream';




export default async function handler(req, res) {
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzNjgwREU5MDNBRUIxMjc2NEZGRDJhOWNDRUFDNTNFYjdkMzVkQkIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQ1MzA5NTA3NzQsIm5hbWUiOiJidWlsZGVyIn0.4B_Mvq1WvDruzbxzU37gHS4cfKG6DVsp4dDkdo495eA'; // Replace with your API key
    const client = new Web3Storage({ token: apiKey });
    try {
        console.log("caller")
        const projectBuild = await getFilesRecursively("/Users/SOC SOLUTION/Desktop/SOC/builder/.next");


        const CHUNK_SIZE = 1; // You can adjust this size based on your needs
        let currentChunkIndex = 0;

        const stream = new Readable({
            read() {
                // if (currentChunkIndex < projectBuild.length) {
                    console.log("IF Condition Bfore")
                    try {
                        const chunk = projectBuild.slice(currentChunkIndex, currentChunkIndex + CHUNK_SIZE);
                        console.log("my Chunk ", chunk[0])
                        let test = JSON.stringify(chunk[0])
                        console.log("chunk length ===> ", chunk.length)
                        let mapAll = projectBuild.map((val) => {
                            console.log("My JSON chunk ==> ",val)
                            this.push(JSON.stringify(val)) 
                        })
                       
                        // return
                        // this.push(JSON.stringify(chunk)); // Push the chunked data into the stream
                        // currentChunkIndex += CHUNK_SIZE;
                        // console.log("After ", chunk)
                    } catch (error) {
                        console.log(error)
                        return 
                    }
                    // const chunk = projectBuild.slice(currentChunkIndex, currentChunkIndex + CHUNK_SIZE);
                    // this.push(JSON.stringify(chunk)); // Push the chunked data into the stream
                 
                // }
                //  else {
                //     this.push(null); // Indicate the end of data
                // }
            }
        });

        const chunks = [];
        stream.on('data', (chunk) => {
            console.log("Before push")
            chunks.push(chunk);
            console.log("Push ===> ", chunks)

        });

        stream.on('end', () => {
            const blob = new Blob(chunks, { type: "application/json" });
            const fileObject = new File([blob], "arrayData.json", { type: "application/json" });
            console.log("Final ===> ", fileObject)
            // ... continue with your upload logic here
        });
        // const { cid } = await client.put(fileObject);
        // console.log(`Uploaded to IPFS with CID: ${cid}`);
        return res.status(200).json({ build: "projectBuild" });
    } catch (error) {
        console.log("Error from server ===> ", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getFilesRecursively(dir) {
    const fs = require('fs');
    const util = require('util');
    const readdir = util.promisify(fs.readdir);
    const stat = util.promisify(fs.stat);

    const files = [];
    const entries = await readdir(dir);

    for (const entry of entries) {
        const entryPath = `${dir}/${entry}`;
        const entryStat = await stat(entryPath);

        if (entryStat.isDirectory()) {
            const nestedFiles = await getFilesRecursively(entryPath);
            files.push(...nestedFiles);
        } else {
            files.push(new File([fs.readFileSync(entryPath)], { path: entryPath.replace(dir, '') }));
        }
    }

    return files;
}

// async function* getFilesRecursivelyGenerator(dir) {
//     const fs = require('fs');
//     const util = require('util');
//     const readdir = util.promisify(fs.readdir);
//     const stat = util.promisify(fs.stat);

//     const entries = await readdir(dir);
//     for (const entry of entries) {
//         const entryPath = `${dir}/${entry}`;
//         const entryStat = await stat(entryPath);
//         if (entryStat.isDirectory()) {
//             yield* getFilesRecursivelyGenerator(entryPath);
//         } else {
//             const relativePath = String(entryPath.replace(dir, ''));
//             yield new File([fs.readFileSync(entryPath)], relativePath);
//         }
//     }
// }


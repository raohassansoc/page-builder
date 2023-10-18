// const { File } = require('@web3-storage/file');
import { File, Web3Storage } from 'web3.storage';
const fs = require('fs');
const path = require('path');


export default async function handler(req, res) {
    console.log("my body Data ===> ", req.body)
    try {

        const client = new Web3Storage({ token: 'YOUR_W3_STORAGE_API_TOKEN' });

        function prepareFilesForUpload(directory) {
            const results = [];


            function getFiles(dir, prefix = '') {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const fileStat = fs.statSync(filePath);


                    if (fileStat.isDirectory()) {
                        results.push(...getFiles(filePath, prefix + file + '/'));
                    } else {
                        results.push(new File([fs.readFileSync(filePath)], prefix + file));
                    }
                }
            }


            getFiles(directory);
            return results;
        }


        async function uploadNextBuildToW3Storage() {
            console.log('Preparing files for upload...');
            const files = prepareFilesForUpload('./path-to-nextjs-build');


            console.log('Uploading to W3 storage...');
            const cid = await client.put(files);

            console.log(`Next.js app uploaded! CID: ${cid}`);
            console.log(`You can access your app at: https://dweb.link/ipfs/${cid}/`);
        }


        uploadNextBuildToW3Storage().catch(console.error)

    } catch (error) {
        console.log(error)
    }

}
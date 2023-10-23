require('dotenv').config();
import { exec } from 'child_process';
// import util from 'util';
// const execAsync = util.promisify(exec);

export default async function handler(req, res) {
  console.log("Starting build process....");

  try {

    exec('npm run build', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error during build:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
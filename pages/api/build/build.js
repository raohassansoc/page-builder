import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  try {
    const { stdout, stderr } = await execAsync('npm run build');
    res.status(200).json({ success: true, stdout, stderr });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
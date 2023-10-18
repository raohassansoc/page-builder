import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

export default async function handler(req, res) {
  try {
    const folderPath = path.join(process.cwd(), '.next');

    // Check if the folder exists
    const folderExists = fs.existsSync(folderPath);
    if (!folderExists) {
      return res.status(404).end('Folder not found');
    }

    // Create a ZIP archive
    res.setHeader('Content-Disposition', `attachment; filename=.next.zip`);
    res.setHeader('Content-Type', 'application/zip');
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Set the compression level (optional)
    });
    archive.pipe(res);

    // Add the entire .next folder to the archive
    archive.directory('.next', false);

    archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).end('Internal Server Error');
  }
}

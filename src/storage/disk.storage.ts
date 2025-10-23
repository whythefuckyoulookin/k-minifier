import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { basename, extname } from "path";

export const cssDiskStorage = () => diskStorage({
  destination: (req, _, cb) => {
    const clientSite = req.headers['x-client-site'];
    let folderName = '__unknown_client__';

    if (clientSite && typeof clientSite === 'string' && clientSite.trim() != '') {
      folderName = clientSite
    }

    const uploadPath = `./uploads/${folderName}`;

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath)
  },
  filename: (_, file, cb) => {
    const originalName = file.originalname
    const fileExt = extname(originalName)
    const fileNameWithoutExt = basename(originalName, fileExt);
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const newFileName = `${fileNameWithoutExt}.${unixTimestamp}${fileExt}`;
    cb(null, newFileName);
  },
})
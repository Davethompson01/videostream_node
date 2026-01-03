import multer from "multer";
import fs, { existsSync } from "fs";

const uploads = "uploads";

if (!existsSync(uploads)) {
  fs.mkdirSync(uploads);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploads),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export default storage;

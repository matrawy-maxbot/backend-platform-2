import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const saveFile = (file, folder = 'uploads') => {
    const filePath = join(__dirname, '../', folder, file.name);
    file.mv(filePath, (err) => {
        if (err) throw err;
    });
    return filePath;
};

const deleteFile = (filePath) => {
    if (existsSync(filePath)) {
        unlinkSync(filePath);
    }
};

export default { saveFile, deleteFile };

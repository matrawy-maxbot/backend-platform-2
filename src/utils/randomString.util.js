import { randomBytes } from 'crypto';

const generateRandomString = (length = 32) => {
    return randomBytes(length).toString('hex');
};

export default { generateRandomString };

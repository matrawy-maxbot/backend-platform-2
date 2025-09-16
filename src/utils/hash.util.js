import { genSalt, hash as _hash, compare } from 'bcryptjs';

const hashPassword = async (password, saltNumber = 10) => {
    const salt = await genSalt(saltNumber);
    return await _hash(password, salt);
};

const comparePassword = async (password, hash) => {
    return await compare(password, hash);
};

export { hashPassword, comparePassword };
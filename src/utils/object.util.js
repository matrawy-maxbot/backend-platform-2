export const excludeObjectKeys = (object, keys) => {
    const newObject = { ...object };
    keys.forEach(key => delete newObject[key]);
    return newObject;
};
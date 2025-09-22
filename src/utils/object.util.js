export const excludeObjectKeys = (object, keys) => {
    const newObject = { ...object };
    keys.forEach(key => delete newObject[key]);
    return newObject;
};

export const resolveDatabaseResult = (result) => {
   result = result?.data ? result.data : result;
   result = result ? result : [];
   result = Array.isArray(result) ? result : result ? [result] : [];
   result = result.length == 1 && (result[0] == null || !result[0]) ? [] : result;
   return result;
};
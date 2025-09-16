import { object } from 'joi';

const validate = (data, schemaConfig, errorThrow = false) => {
    if(!schemaConfig) { 
        throw new Error('Schema is required for validation');
    }
    const schema = object(schemaConfig).unknown();

    const { value: schemaData, error } = schema.validate(data, {
        abortEarly: false, // عرض جميع الأخطاء
    });
    
    if (error) {
        if(errorThrow) {
            throw new Error(`Data validation error: ${error.details.map((x) => x.message).join(', ')}`);
        } else {
            console.error(`Data validation error: ${error.details.map((x) => x.message).join(', ')}`);
        }
    }

    return schemaData;
};

export default { validate };

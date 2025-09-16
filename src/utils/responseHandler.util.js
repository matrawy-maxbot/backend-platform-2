const successResponse = (res, data, message = 'success', status = 200) => {
    res.status(status).write(Object.keys(data).length > 0 ? JSON.stringify({ success: true, message, data }) : JSON.stringify({ success: true, message }));
    return res.end();
};

export default successResponse;

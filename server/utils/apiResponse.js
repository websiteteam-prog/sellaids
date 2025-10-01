export const successResponse = (res, statusCode = 200, msg, result, meta = null) => {
    const response = {
        success: true,
        message: msg,
        data: result
    };

    if (meta) response.meta = meta;

    return res.status(statusCode).json(response);
};
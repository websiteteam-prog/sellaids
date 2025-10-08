export const successResponse = (res, statusCode, msg, result, extra = null) => {
    const response = {
        success: true,
        message: msg,
        data: result
    };

    if (extra && typeof extra === "object") {
        Object.assign(response, extra);
    }

    return res.status(statusCode).json(response);
};
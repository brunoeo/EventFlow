export const ok = (body) => {
    return {
        success: true,
        statusCode: 200,
        body: body
    }
}

export const notFound = (message = 'Not Found') => {
        return {
        success: false,
        statusCode: 404,
        body: message
    }
}

export const serverError = (error) => {
    return {
        success: false,
        statusCode: 500,
        body: error
    }
}
import { ServerError } from '../../error/server-error'
import { UnauthorizedError } from '../../error/unauthorized-error'
import { HttpResponse } from '../../protocols/http-request'

export const badResquest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const unauthorized = (): HttpResponse => {
    return {
        statusCode: 401,
        body: new UnauthorizedError()
    }
}

export const serverError = (error: Error): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error.stack)
    }
}

export const ok = (data: any): HttpResponse => {
    return {
        statusCode: 200,
        body: data
    }
}
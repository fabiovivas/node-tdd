import { ServerError } from '../error/server-error'
import { HttpResponse } from '../protocols/http-request'

export const badResquest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const serverError = (): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError()
    }
}
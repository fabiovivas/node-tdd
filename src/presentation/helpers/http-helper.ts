import { HttpResponse } from '../protocols/http-request'

export const badResquest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}
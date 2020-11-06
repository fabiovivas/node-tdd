import { HttpResponse } from '../protocols/httpRequest'

export const badResquest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}
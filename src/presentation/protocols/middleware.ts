import { HttpRequest, HttpResponse } from './http-request'

export interface Middleware {
    handle: (httpeRequest: HttpRequest) => Promise<HttpResponse>
}
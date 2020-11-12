import { HttpRequest, HttpResponse } from './http-request'

export interface Controller {
    handle: (httpeRequest: HttpRequest) => Promise<HttpResponse>
}
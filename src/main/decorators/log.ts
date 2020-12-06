import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http-request'

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller
    constructor(controller: Controller) {
        this.controller = controller
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        await this.controller.handle(httpeRequest)
        return null
    }
}
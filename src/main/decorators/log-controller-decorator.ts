import { LogErrorRepository } from '../../data/protocols/db/log/log-repository'
import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http-request'

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller
    private readonly logErrorRepository: LogErrorRepository
    constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }

    async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpeRequest)
        if (httpResponse.statusCode === 500) {
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }
        return httpResponse
    }
}
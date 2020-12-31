import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcriptyAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adpter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols/controller'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
    const salt = 12
    const bcrypterAdapter = new BcriptyAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcrypterAdapter, jwtAdapter, accountMongoRepository)
    const loginController = new LoginController(dbAuthentication, makeLoginValidation())
    const logMongoRespository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logMongoRespository)
}
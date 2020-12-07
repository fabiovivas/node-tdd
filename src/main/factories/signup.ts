import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcriptyAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup'
import { Controller } from '../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcrypter = new BcriptyAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcrypter, accountMongoRepository)
    const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    const logMongoRespository = new LogMongoRepository()
    return new LogControllerDecorator(signupController, logMongoRespository)
}
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcriptyAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcrypter = new BcriptyAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcrypter, accountMongoRepository)
    const signupController = new SignUpController(dbAddAccount, makeSignUpValidation())
    const logMongoRespository = new LogMongoRepository()
    return new LogControllerDecorator(signupController, logMongoRespository)
}
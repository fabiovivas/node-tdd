import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcriptyAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcrypter = new BcriptyAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcrypter, accountMongoRepository)
    const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    return signupController
}
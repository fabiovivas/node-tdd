import { DbAddAccount } from '../../../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../../../domain/usecases/add-account'
import { BcriptyAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12
    const bcrypter = new BcriptyAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcrypter, accountMongoRepository, accountMongoRepository)
}
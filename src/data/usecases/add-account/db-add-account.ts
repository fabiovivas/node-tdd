import { AccountModel } from '../../../domain/model/account-model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly Hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository
    ) { }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.Hasher.hash(account.password)
        return this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    }
}
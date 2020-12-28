import { AccountModel } from '../../../domain/model/account-model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'

export class DbAddAccount implements AddAccount {
    private readonly Hasher: Hasher
    private readonly addAccountRepository: AddAccountRepository
    constructor(Hasher: Hasher, addAccountRepository: AddAccountRepository) {
        this.Hasher = Hasher
        this.addAccountRepository = addAccountRepository
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.Hasher.hash(account.password)
        return this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    }
}
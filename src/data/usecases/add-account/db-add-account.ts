import { AccountModel } from '../../../domain/model/account-model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-email-by-repository'

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly Hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) { }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const result = await this.loadAccountByEmailRepository.loadByEmail(account.email)
        if (result) return null

        const hashedPassword = await this.Hasher.hash(account.password)
        return this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    }
}
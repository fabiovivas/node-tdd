import { AccountModel } from '../../../domain/model/account-model'

export interface LoadAccountByEmailRepository {
    loadByEmail: (email: string) => Promise<AccountModel>
}
import { AccountModel } from '../../domain/model/account-model'

export interface LoadAccountByEmailRepository {
    load: (email: string) => Promise<AccountModel>
}
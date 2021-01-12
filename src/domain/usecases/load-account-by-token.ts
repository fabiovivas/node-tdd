import { AccountModel } from '../model/account-model'

export interface LoadAccountByToken {
    load: (accessToken: string, role?: string) => Promise<AccountModel>
}
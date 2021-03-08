import { AccountModel } from '@/domain/model/account-model'

export interface LoadAccountByTokenRepository {
    loadByToken: (accessToken: string, role?: string) => Promise<AccountModel>
}
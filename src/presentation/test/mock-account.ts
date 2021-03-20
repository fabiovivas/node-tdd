import { AccountModel } from '@/domain/model/account-model'
import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountParams): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }
    }

    return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
    class Authentication implements Authentication {
        async auth(authentication: AuthenticationParams): Promise<string> {
            return 'any_token'
        }
    }
    return new Authentication()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string): Promise<AccountModel> {
            return mockAccountModel()
        }
    }
    return new LoadAccountByTokenStub()
}
import { AccountModel } from '@/domain/model/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_value'
})

export const mockAccountParams = (): AddAccountParams => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

export const mockAuthentication = (): AuthenticationParams => (
    { email: 'valid_email', password: 'valid_password' }
)
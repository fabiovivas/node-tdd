import { AccountModel } from '../../model/account-model'

export type AddAccountParams = Omit<AccountModel, 'id'>

export interface AddAccount {
    add: (account: AddAccountParams) => Promise<AccountModel>
}
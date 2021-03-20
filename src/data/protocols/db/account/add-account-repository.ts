import { AccountModel } from '@/domain/model/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
    add: (accountData: AddAccountParams) => Promise<AccountModel>
}
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-email-by-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/model/account-model'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.findOne({ email })
        return result && MongoHelper.map(result)
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.updateOne({ _id: id }, {
            $set: {
                accessToken: token
            }
        })
    }

    async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.findOne({
            accessToken,
            $or: [{ role }, { role: 'admin' }]
        })
        return result && MongoHelper.map(result)
    }
}
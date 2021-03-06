import { mockAccountParams } from '@/domain/test'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    describe('add()', () => {
        test('Should return an account on add success', async () => {
            const sut = makeSut()
            const account = await sut.add(mockAccountParams())
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('valid_name')
            expect(account.email).toBe('valid_email')
            expect(account.password).toBe('valid_password')
        })
    })

    describe('loadByEmail()', () => {
        test('Should return an account on loadByEmail success', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(mockAccountParams())

            const account = await sut.loadByEmail('valid_email')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('valid_name')
            expect(account.email).toBe('valid_email')
            expect(account.password).toBe('valid_password')
        })

        test('Should return null if loadByEmail fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByEmail('any_email@mail.com')
            expect(account).toBeFalsy()
        })
    })

    describe('update()', () => {
        test('Should update the account accessToken on UpdateAccessToken', async () => {
            const sut = makeSut()
            const res = await accountCollection.insertOne(mockAccountParams())
            const fakeAccount = res.ops[0]
            expect(res.ops[0].accesToken).toBeFalsy()
            await sut.updateAccessToken(fakeAccount._id, 'any_token')
            const account = await accountCollection.findOne({ _id: fakeAccount._id })
            expect(account).toBeTruthy()
            expect(account.accessToken).toBe('any_token')
        })
    })

    describe('loadByToken()', () => {
        test('Should return an account on loadByToken success whitout role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token'
            })

            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@mail.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return an account on loadByToken success whith admin role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'admin'
            })

            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@mail.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return null on loadByToken whith inválid role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token'
            })

            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeFalsy()
        })

        test('Should return an account on loadByToken success if userr is admin', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                accessToken: 'any_token',
                role: 'admin'
            })

            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@mail.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return null if loadByToken fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByToken('any_token', 'any_role')
            expect(account).toBeFalsy()
        })
    })
})

import bcrypt from 'bcrypt'
import { BcriptyAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return Promise.resolve('hash')
    },

    async compare(): Promise<boolean> {
        return Promise.resolve(true)
    }
}))

const salt = 12
const makeSut = (): BcriptyAdapter => {
    return new BcriptyAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call hash with correct values', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Shoul throws if bcrypt throw', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })

    test('Should return a valid hash on hash success', async () => {
        const sut = makeSut()
        const result = await sut.hash('any_value')
        expect(result).toBe('hash')
    })

    test('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
        const sut = makeSut()
        const result = await sut.compare('any_value', 'any_hash')
        expect(result).toBe(true)
    })

    test('Should return false when compare succeeds', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false)
        const result = await sut.compare('any_value', 'any_hash')
        expect(result).toBe(false)
    })
})

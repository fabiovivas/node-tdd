import bcrypt from 'bcrypt'
import { BcriptyAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => {
    return {
        async hash(): Promise<string> {
            return Promise.resolve('hash')
        }
    }
})

const salt = 12
const makeSut = (): BcriptyAdapter => {
    return new BcriptyAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct values', async () => {
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

    test('Should return a hash on success', async () => {
        const sut = makeSut()
        const result = await sut.hash('any_value')
        expect(result).toBe('hash')
    })
})

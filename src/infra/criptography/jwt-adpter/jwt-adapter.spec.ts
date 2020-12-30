import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return Promise.resolve('any_token')
    }
}))

describe('JwtAdapter', () => {
    test('Should call sign with correct values', async () => {
        const sut = new JwtAdapter('secret')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should throws if sign throws', async () => {
        const sut = new JwtAdapter('secret')
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.encrypt('any_id')
        await expect(promise).rejects.toThrow()
    })

    test('Should return a token on sign success', async () => {
        const sut = new JwtAdapter('secret')
        const token = await sut.encrypt('any_id')
        expect(token).toEqual('any_token')
    })
})

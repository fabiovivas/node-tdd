
import { MissingParamError } from '../../presentation/error/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
    test('Should return a MissingParamError if validations fails', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ field: 'any_name' })
        expect(error).toBeFalsy()
    })
})

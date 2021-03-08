import { Validation } from '@/presentation/protocols/validation'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] = []
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new EmailValidation('email', makeEmailValidatorStub()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})

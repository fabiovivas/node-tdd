import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { EmailValidation } from '../../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation-factory'
import { CompareFieldsValidation } from '../../../../../validation/validators/compare-fields-validation'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

describe('SignUpValidation Factorie', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidatorStub()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})

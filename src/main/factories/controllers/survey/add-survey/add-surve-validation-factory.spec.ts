import { Validation } from '../../../../../presentation/protocols/validation'
import { RequiredFieldValidation } from '../../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../../validation/validators/validation-composite'
import { makeSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSurveyValidation()
        const validations: Validation[] = []
        for (const field of ['question', 'answers']) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})

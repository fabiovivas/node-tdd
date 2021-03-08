import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'

export const makeSurveyValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
        validations.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validations)
}
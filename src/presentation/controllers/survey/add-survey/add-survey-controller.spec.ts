import { badResquest } from '../../../helpers/http/http-helper'
import { HttpRequest } from '../../../protocols/http-request'
import { Validation } from '../../../protocols/validation'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }]
    }
})

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return {
        sut,
        validationStub
    }
}

describe('AddSurvey Controller', () => {
    test('Should call Validation withc correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation fails', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
        const httpRequest = makeFakeRequest()
        const result = await sut.handle(httpRequest)
        expect(result).toEqual(badResquest(new Error()))
    })
})

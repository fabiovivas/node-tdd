import { badResquest, serverError, noContent } from '../../../helpers/http/http-helper'
import { HttpRequest } from '../../../protocols/http-request'
import { Validation } from '../../../protocols/validation'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, AddSurveyModel } from '../../../../domain/usecases/add-survey'

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

const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyModel): Promise<void> { }
    }
    return new AddSurveyStub()
}

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const addSurveyStub = makeAddSurveyStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
        sut,
        validationStub,
        addSurveyStub
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
        const result = await sut.handle(makeFakeRequest())
        expect(result).toEqual(badResquest(new Error()))
    })

    test('Should call AddSurvey withc correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 500 if AddSurvey return a error', async () => {
        const { sut, addSurveyStub } = makeSut()
        jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
        const result = await sut.handle(makeFakeRequest())
        expect(result).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
        const { sut } = makeSut()
        const result = await sut.handle(makeFakeRequest())
        expect(result).toEqual(noContent())
    })
})

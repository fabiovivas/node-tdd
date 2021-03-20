import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/error/invalid-param-error'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols/http-request'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test'

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_id'
    },
    body: {
        answer: 'any_answer'
    },
    accountId: 'any_account_id'
})

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const saveSurveyResultStub = mockSaveSurveyResult()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub
    }
}

describe('SaveSurveyResult Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loabByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        const request = makeFakeRequest()
        await sut.handle(request)
        expect(loabByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
        const request = makeFakeRequest()
        const response = await sut.handle(request)
        expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
    })

    test('Should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
        const request = makeFakeRequest()
        const response = await sut.handle(request)
        expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 403 if invalid answer is provided', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({
            params: {
                surveyId: 'any_id'
            },
            body: {
                answer: 'wrong_answer'
            },
            accountId: 'any_account_id'
        })
        expect(response).toEqual(forbidden(new InvalidParamError('answer')))
    })

    test('Should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
        const request = makeFakeRequest()
        await sut.handle(request)
        expect(saveSpy).toHaveBeenCalledWith({
            surveyId: 'any_id',
            accountId: 'any_account_id',
            date: new Date(),
            answer: 'any_answer'
        })
    })

    test('Should return 500 if SaveSurveyResult throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
        const request = makeFakeRequest()
        const response = await sut.handle(request)
        expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(makeFakeRequest())
        expect(response).toEqual(ok(mockSurveyResultModel()))
    })
})

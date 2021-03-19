import { SurveyModel } from '@/domain/model/survey-model'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/error/invalid-param-error'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols/http-request'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/model/survey-result-model'

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_id'
    },
    body: {
        answer: 'any_answer'
    },
    accountId: 'any_account_id'
})

const makeSurveyModel = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

const makeSurveyResultModel = (): SurveyResultModel => ({
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
})

const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return makeSurveyResultModel()
        }
    }
    return new SaveSurveyResultStub()
}

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return makeSurveyModel()
        }
    }
    return new LoadSurveyByIdStub()
}

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSaveSurveyResult()
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
})

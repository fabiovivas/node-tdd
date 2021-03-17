import { SurveyModel } from '@/domain/model/survey-model'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/error/invalid-param-error'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols/http-request'
import { SaveSurveyResultController } from './save-survey-result-controller'

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_id'
    }
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
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)
    return {
        sut,
        loadSurveyByIdStub
    }
}

describe('SaveSurveyResult Controller', () => {
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
})

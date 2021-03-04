import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { LoadSurveysController } from './load-survey-controller'
import MockDate from 'mockdate'
import { ok, serverError } from '../../../helpers/http/http-helper'

interface SutTypes {
    sut: LoadSurveysController
    loadSurveyStub: LoadSurveys
}

const makeLoadSurvey = (): LoadSurveys => {
    class LoadSurveyStub implements LoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return makeFakeSurverys()
        }
    }
    return new LoadSurveyStub()
}

const makeFakeSurverys = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }]
}

const makeSut = (): SutTypes => {
    const loadSurveyStub = makeLoadSurvey()
    const sut = new LoadSurveysController(loadSurveyStub)
    return {
        loadSurveyStub,
        sut
    }
}

describe('LoadSurveys Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveys', async () => {
        const { sut, loadSurveyStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyStub, 'load')
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(makeFakeSurverys()))
    })

    test('Should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveyStub } = makeSut()
        jest.spyOn(loadSurveyStub, 'load').mockRejectedValue(new Error())
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
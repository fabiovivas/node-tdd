import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/model/survey-model'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById(id: string): Promise<SurveyModel> {
            return makeFakeSurvey()
        }
    }
    return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

describe('LoadSurveyById UseCase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should calls LoadSurveyByIdRepository with correct value', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadById('any_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return a Survey on success', async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById('any_id')
        expect(survey).toEqual(makeFakeSurvey())
    })

    test('Should throws if LoadSurveyByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValue(new Error())
        const promise = sut.loadById('any_id')
        await expect(promise).rejects.toThrow()
    })
})

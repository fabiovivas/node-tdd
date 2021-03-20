import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from '../../../protocols/db/survey/load-surveys-repository'
import MockDate from 'mockdate'
import { mockSurveysModels } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'

type SutTypes = {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = mockLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    return {
        sut,
        loadSurveysRepositoryStub
    }
}

describe('LoadSurveys UseCase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should calls LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
        await sut.loadAll()
        expect(loadSpy).toHaveBeenCalled()
    })

    test('Should return a list of Surveys on success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.loadAll()
        expect(surveys).toEqual(mockSurveysModels())
    })

    test('Should throws if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValue(new Error())
        const promise = sut.loadAll()
        await expect(promise).rejects.toThrow()
    })
})

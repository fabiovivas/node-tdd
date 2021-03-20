import { AddSurveyRepository } from '../../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { mockAddSurveyRepository } from '@/data/test'
import { mockSurveyParams } from '@/domain/test'

type SutTypes = {
    sut: DbAddSurvey
    dbAddSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
    const dbAddSurveyRepositoryStub = mockAddSurveyRepository()
    const sut = new DbAddSurvey(dbAddSurveyRepositoryStub)
    return {
        sut,
        dbAddSurveyRepositoryStub
    }
}

describe('DbAddSurvey Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should calls AddSurveyRepository with correct values', async () => {
        const { sut, dbAddSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(dbAddSurveyRepositoryStub, 'add')
        const data = mockSurveyParams()
        await sut.add(data)
        expect(addSpy).toHaveBeenLastCalledWith(data)
    })

    test('Should throws if AddSurveyRepository throws', async () => {
        const { sut, dbAddSurveyRepositoryStub } = makeSut()
        jest.spyOn(dbAddSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
        const promise = sut.add(mockSurveyParams())
        await expect(promise).rejects.toThrow()
    })
})
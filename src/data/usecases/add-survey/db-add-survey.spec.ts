import { AddSurveyModel } from '../../../domain/usecases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
    class DbAddSurveyRepositoryStub implements AddSurveyRepository {
        async add(data: AddSurveyModel): Promise<void> { }
    }
    return new DbAddSurveyRepositoryStub()
}

interface SutTypes {
    sut: DbAddSurvey
    dbAddSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
    const dbAddSurveyRepositoryStub = makeAddSurveyRepository()
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
        const data = makeFakeSurveyData()
        await sut.add(data)
        expect(addSpy).toHaveBeenLastCalledWith(data)
    })

    test('Should throws if AddSurveyRepository throws', async () => {
        const { sut, dbAddSurveyRepositoryStub } = makeSut()
        jest.spyOn(dbAddSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
        const promise = sut.add(makeFakeSurveyData())
        await expect(promise).rejects.toThrow()
    })
})
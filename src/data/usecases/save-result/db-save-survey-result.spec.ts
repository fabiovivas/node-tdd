
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'

const makeFakeSurveyResult = (): SurveyResultModel => {
    return {
        id: 'any_id',
        surveyId: 'any_survey_id',
        accountId: 'any_account_id',
        answer: 'any_answer',
        date: new Date()
    }
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => {
    return {
        surveyId: 'any_survey_id',
        accountId: 'any_account_id',
        answer: 'any_answer',
        date: new Date()
    }
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class DbSaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return makeFakeSurveyResult()
        }
    }
    return new DbSaveSurveyResultRepositoryStub()
}

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

describe('DbSaveSurveyResult Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const data = makeFakeSurveyResultData()
        await sut.save(data)
        expect(saveSpy).toHaveBeenCalledWith(data)
    })

    test('Should throws if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })
})
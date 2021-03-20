import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor(private readonly saveSureveyResultRepository: SaveSurveyResultRepository) { }
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return await this.saveSureveyResultRepository.save(data)
    }
}
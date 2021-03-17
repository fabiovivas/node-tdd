import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor(private readonly saveSureveyResultRepository: SaveSurveyResultRepository) { }
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        return await this.saveSureveyResultRepository.save(data)
    }
}
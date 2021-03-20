import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
    save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
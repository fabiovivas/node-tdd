import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
    save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
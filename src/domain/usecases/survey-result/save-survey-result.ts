import { SurveyResultModel } from '../../model/survey-result-model'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>
export interface SaveSurveyResult {
    save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
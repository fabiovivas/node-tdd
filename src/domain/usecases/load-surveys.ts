import { SurveyModel } from '../model/survey-model'

export interface LoadSurveys {
    loadAll: () => Promise<SurveyModel[]>
}
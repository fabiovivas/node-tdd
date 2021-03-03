import { SurveyModel } from '../model/survey-model'

export interface LoadSurveys {
    load: () => Promise<SurveyModel[]>
}
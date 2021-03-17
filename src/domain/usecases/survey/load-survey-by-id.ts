import { SurveyModel } from '../../model/survey-model'

export interface LoadSurveyById {
    loadById: (id: string) => Promise<SurveyModel>
}
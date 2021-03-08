import { SurveyModel } from '../model/survey-model'

export type AddSurveyModel = Omit<SurveyModel, 'id'>
export interface AddSurvey {
    add: (data: AddSurveyModel) => Promise<void>
}
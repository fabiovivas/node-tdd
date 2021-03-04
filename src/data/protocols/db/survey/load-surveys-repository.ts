import { SurveyModel } from '../../../../domain/model/survey-model'

export interface LoadSurveysRepository {
    loadAll: () => Promise<SurveyModel[]>
}
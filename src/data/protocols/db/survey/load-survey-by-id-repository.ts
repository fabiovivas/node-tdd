import { SurveyModel } from '@/domain/model/survey-model'

export interface LoadSurveyByIdRepository {
    loadById: (id: string) => Promise<SurveyModel>
}
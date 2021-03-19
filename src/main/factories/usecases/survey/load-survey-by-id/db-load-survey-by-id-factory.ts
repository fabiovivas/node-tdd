import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
    const loadSurveyByIdRepository = new SurveyMongoRepository()
    return new DbLoadSurveyById(loadSurveyByIdRepository)
}
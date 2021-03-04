import { SurveyModel } from '../../../domain/model/survey-model'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'

export class DbLoadSurveys implements LoadSurveysRepository {
    constructor(private readonly loadSurveysRepository: LoadSurveysRepository) { }
    async loadAll(): Promise<SurveyModel[]> {
        return await this.loadSurveysRepository.loadAll()
    }
}
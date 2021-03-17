import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/model/survey-model'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
    constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }
    async loadById(id: string): Promise<SurveyModel> {
        return await this.loadSurveyByIdRepository.loadById(id)
    }
}
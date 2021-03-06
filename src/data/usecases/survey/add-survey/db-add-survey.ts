import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '../../../protocols/db/survey/add-survey-repository'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly dbAddSurvey: AddSurveyRepository) { }

  async add(data: AddSurveyParams): Promise<void> {
    await this.dbAddSurvey.add(data)
  }
}
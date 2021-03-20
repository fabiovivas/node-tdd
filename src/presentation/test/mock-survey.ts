import { SurveyModel } from '@/domain/model/survey-model'
import { mockSurveyModel, mockSurveysModels } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyParams): Promise<void> { }
    }
    return new AddSurveyStub()
}

export const mockLoadSurvey = (): LoadSurveys => {
    class LoadSurveyStub implements LoadSurveys {
        async loadAll(): Promise<SurveyModel[]> {
            return mockSurveysModels()
        }
    }
    return new LoadSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return mockSurveyModel()
        }
    }
    return new LoadSurveyByIdStub()
}
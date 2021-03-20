import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return mockSurveyResultModel()
        }
    }
    return new SaveSurveyResultStub()
}
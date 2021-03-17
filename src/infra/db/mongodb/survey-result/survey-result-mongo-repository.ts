import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/model/survey-result-model'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const res = await surveyResultCollection.findOneAndUpdate({
            surveyId: new ObjectId(data.surveyId),
            accountId: new ObjectId(data.accountId)
        }, {
            $set: {
                answer: data.answer,
                date: data.date
            }
        }, {
            upsert: true,
            returnOriginal: false
        })
        return res.value && MongoHelper.map(res.value)
    }
}
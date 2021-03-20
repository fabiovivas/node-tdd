import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/model/survey-model'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
    async add(data: AddSurveyParams): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.insertOne(data)
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const result = await surveyCollection.find().toArray()
        return MongoHelper.mapCollection(result)
    }

    async loadById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const result = await surveyCollection.findOne({ _id: new ObjectId(id) })
        return result && MongoHelper.map(result)
    }
}
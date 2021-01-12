import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    test('Should add a survey on success', async () => {
        const sut = makeSut()
        await sut.add({
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer: 'any_answer'
            }]
        })
        const survey = await surveyCollection.findOneAndDelete({ question: 'any_question' })
        expect(survey).toBeTruthy()
    })
})
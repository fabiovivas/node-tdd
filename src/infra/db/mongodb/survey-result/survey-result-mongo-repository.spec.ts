import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/model/survey-model'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }, {
            image: 'other_image',
            answer: 'other_answer'
        }],
        date: new Date()
    })
    return MongoHelper.map(res.ops[0])
}

const makeAccountId = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: 'any_email',
        email: 'any_email',
        password: 'any_password'
    })
    return res.ops[0]._id
}

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
        MockDate.set(new Date())
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})

        surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        await surveyCollection.deleteMany({})

        accountCollection = await MongoHelper.getCollection('accounts')
        await surveyCollection.deleteMany({})
        MockDate.reset()
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSut = (): SurveyResultMongoRepository => {
        return new SurveyResultMongoRepository()
    }

    describe('save', () => {
        test('Should add a survey result if its new', async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const accountId = await makeAccountId()
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId,
                answer: survey.answers[0].answer,
                date: new Date()
            })
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.answer).toBe(survey.answers[0].answer)
        })

        test('Should update a survey result if its not new', async () => {
            const survey = await makeSurvey()
            const accountId = await makeAccountId()
            const res = await surveyResultCollection.insertOne({
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId),
                answer: survey.answers[0].answer,
                date: new Date()
            })
            const sut = makeSut()
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId: accountId,
                answer: survey.answers[1].answer,
                date: new Date()
            })
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toEqual(res.ops[0]._id)
            expect(surveyResult.answer).toBe(survey.answers[1].answer)
        })
    })
})

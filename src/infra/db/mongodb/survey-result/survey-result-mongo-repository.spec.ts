import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/model/survey-model'
import { AccountModel } from '@/domain/model/account-model'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    })
    return res.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
        name: 'any_email',
        email: 'any_email',
        password: 'any_password'
    })
    return res.ops[0]
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
            const account = await makeAccount()
            const surveyResult = await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date()
            })
            const result = await surveyResultCollection.findOne({
                surveyId: survey.id,
                accountId: account.id
            })
            expect(result).toBeTruthy()
            expect(surveyResult.answer).toBe(survey.answers[0].answer)
        })
    })
})

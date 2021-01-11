import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

describe('Login Routes', () => {
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

    describe('POST /survey', () => {
        test('Should return 204 on add survey success', async () => {
            await request(app)
                .post('/api/survey')
                .send({
                    question: 'any_question',
                    answers: [{
                        image: 'https://image',
                        answers: 'any_answer'
                    },
                    {
                        answer: 'any_answer'
                    }]
                })
                .expect(204)
        })
    })
})

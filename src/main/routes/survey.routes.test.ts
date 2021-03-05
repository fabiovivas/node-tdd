import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const generateAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: 'Fabio',
        email: 'fviva1982@gmail.com',
        password: 123,
        role: 'admin'
    })
    const id = res.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    return accessToken
}

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        accountCollection = await MongoHelper.getCollection('accounts')
        await surveyCollection.deleteMany({})
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    describe('POST /survey', () => {
        test('Should return 403 on add survey without accessToken', async () => {
            await request(app)
                .post('/api/surveys')
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
                .expect(403)
        })

        test('Should return 204 on add survey without accessToken', async () => {
            const accessToken = await generateAccessToken()
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
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

    describe('GET /surveys', () => {
        test('Should return 403 on load survey without accessToken', async () => {
            await request(app)
                .get('/api/surveys')
                .expect(403)
        })

        test('Should return 200 on load survey with accessToken', async () => {
            const accessToken = await generateAccessToken()
            await surveyCollection.insertMany([
                {
                    question: 'any_question',
                    answers: [{
                        image: 'any_image',
                        answer: 'any_answer'
                    }],
                    date: new Date()
                },
                {
                    question: 'other_question',
                    answers: [{
                        image: 'other_image',
                        answer: 'other_answer'
                    }],
                    date: new Date()
                }
            ])
            await request(app)
                .get('/api/surveys')
                .set('x-access-token', accessToken)
                .expect(200)
        })
    })
})

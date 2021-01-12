import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
                .expect(403)
        })

        test('Should return 204 on add survey without accessToken', async () => {
            const res = await accountCollection.insertOne({
                name: 'Fabio',
                email: 'fviva1982@gmail.com',
                password: 123,
                role: 'admin'
            })
            const id = res.ops[0]._id
            const accessToken = sign({ id }, env.jwtSecret)
            await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
            await request(app)
                .post('/api/survey')
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
                .expect(403)
        })
    })
})

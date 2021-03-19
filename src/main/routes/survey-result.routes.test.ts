/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import MockDate from 'mockdate'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const generateAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: 'Fabio',
        email: 'fviva1982@gmail.com',
        password: 123
    })
    const id = res.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    return accessToken
}

describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
        MockDate.set(new Date())
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        accountCollection = await MongoHelper.getCollection('accounts')
        await surveyCollection.deleteMany({})
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
        MockDate.reset()
    })

    describe('PUT /surveys/:surveyId/results', () => {
        test('Should return 403 on save survey without accessToken', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403)
        })

        test('Should return 200 on save survey with accessToken', async () => {
            const accessToken = await generateAccessToken()
            const res = await surveyCollection.insertOne({
                question: 'any_question',
                answers: [{
                    image: 'https://image',
                    answer: 'any_answer'
                },
                {
                    answer: 'other_answer'
                }]
            })
            await request(app)
                .put(`/api/surveys/${res.ops[0]._id}/results`)
                .set('x-access-token', accessToken)
                .send({
                    answer: 'any_answer'
                })
                .expect(200)
        })
    })
})

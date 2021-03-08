import { LogErrorRepository } from '@/data/protocols/db/log/log-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorCollectioin = await MongoHelper.getCollection('errors')
        await errorCollectioin.insertOne({ stack, date: new Date() })
    }
}
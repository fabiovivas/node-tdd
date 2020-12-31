export default {
    mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || 'jwt90==lkm12'
}
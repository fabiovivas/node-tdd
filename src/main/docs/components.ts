import { badRequest, unauthorized, serverError, forbidden } from './components/index'
import { apiKeyAuthSchema } from './schemas/api-key-auth.schema'

export default {
    securitySchemes: {
        apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    forbidden
}
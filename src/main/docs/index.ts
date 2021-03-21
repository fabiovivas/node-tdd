import { loginPath } from './paths/login-path'
import { surveyPath } from './paths/survey-path'
import { surveyResultPath } from './paths/survey-result-path'
import { signUpPath } from './paths/signup-path'
import { badRequest, unauthorized, serverError, forbidden } from './components/index'
import { accountSchema } from './schemas/account.schema'
import { errorSchema } from './schemas/error.schema'
import { loginParamsSchema } from './schemas/login-params.schema'
import { surveySchema } from './schemas/survey.schema'
import { surveysSchema } from './schemas/surveys.schema'
import { surveyAnswerSchema } from './schemas/survey-answer.schema'
import { apiKeyAuthSchema } from './schemas/api-key-auth.schema'
import { signUpParamsSchema } from './schemas/signup-params.schema'
import { addSurveyParamsSchema } from './schemas/add-survey.schema'
import { saveSurveyParamsSchema } from './schemas/save-survey-param.schema'
import { surveyResultSchema } from './schemas/survey-result.schema'

export default {
    openapi: '3.0.0',
    info: {
        title: 'Clean Node Api',
        description: 'API do curso do mango para realizar enquetes entre programadores',
        version: '1.0.0'
    },
    license: {
        name: 'GPL-3.0-or-later',
        url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    },
    servers: [{
        url: '/api'
    }],
    tags: [{
        name: 'Login'
    }, {
        name: 'Enquete'
    }],
    paths: {
        '/login': loginPath,
        '/signup': signUpPath,
        '/surveys': surveyPath,
        '/surveys/{surveyId}/results': surveyResultPath
    },
    schemas: {
        account: accountSchema,
        loginParams: loginParamsSchema,
        signUpParams: signUpParamsSchema,
        error: errorSchema,
        surveys: surveysSchema,
        survey: surveySchema,
        surveyAnswer: surveyAnswerSchema,
        addSurveyParams: addSurveyParamsSchema,
        saveSurveyParams: saveSurveyParamsSchema,
        surveyResult: surveyResultSchema
    },
    components: {
        securitySchemes: {
            apiKeyAuth: apiKeyAuthSchema
        },
        badRequest,
        unauthorized,
        serverError,
        forbidden
    }
}
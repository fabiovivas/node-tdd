import { accountSchema } from './schemas/account.schema'
import { errorSchema } from './schemas/error.schema'
import { loginParamsSchema } from './schemas/login-params.schema'
import { surveySchema } from './schemas/survey.schema'
import { surveysSchema } from './schemas/surveys.schema'
import { surveyAnswerSchema } from './schemas/survey-answer.schema'
import { signUpParamsSchema } from './schemas/signup-params.schema'
import { addSurveyParamsSchema } from './schemas/add-survey.schema'
import { saveSurveyParamsSchema } from './schemas/save-survey-param.schema'
import { surveyResultSchema } from './schemas/survey-result.schema'

export default {
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
}
import { loginPath } from './paths/login-path'
import { surveyPath } from './paths/survey-path'
import { surveyResultPath } from './paths/survey-result-path'
import { signUpPath } from './paths/signup-path'

export default {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
}
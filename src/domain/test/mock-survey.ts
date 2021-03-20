import { SurveyModel } from '../model/survey-model'
import { AddSurveyParams } from '../usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        },
        {
            image: 'other_image',
            answer: 'other_answer'
        }],
        date: new Date()
    }
}

export const mockSurveysModels = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        },
        {
            image: 'other_image',
            answer: 'other_answer'
        }],
        date: new Date()
    },
    {
        id: 'other_id',
        question: 'other_question',
        answers: [{
            image: 'other_image',
            answer: 'other_answer'
        },
        {
            image: 'other_image',
            answer: 'other_answer'
        }],
        date: new Date()
    }]
}

export const mockSurveyParams = (): AddSurveyParams => {
    return {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        },
        {
            image: 'other_image',
            answer: 'other_answer'
        }],
        date: new Date()
    }
}
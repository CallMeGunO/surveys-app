import { FirebaseData } from './Common'

interface FirebaseSurveyData extends FirebaseData {
    Title: string
    Description: string
    SurveyData: string
    Created: number
    Modified: number
}

interface Survey {
    id: string
    title: string
    description: string
    data: SurveyData
    created: number
    modified: number
}

enum SurveyStatus {
    Draft = 'DRAFT',
    Active = 'ACTIVE',
    Archive = 'ARCHIVE',
}

interface SurveyData {
    content: {
        questionGroups: QuestionGroup[]
        questions: Record<string, Question>
    }
    settings: {
        status: SurveyStatus
    }
}

interface QuestionGroup {
    id: string
    title: string
    questions: string[]
}

enum QuestionType {
    SingleOption = 'SINGLE_OPTION',
    MultipleOptions = 'MULTIPLE_OPTIONS',
    SingleLineText = 'SINGLE_LINE_TEXT',
    MultipleLineText = 'MULTIPLE_LINE_TEXT',
    NumberValue = 'NUMBER_VALUE',
    DateValue = 'DATE_VALUE',
    Rating = 'RATING_VALUE',
}

interface Question {
    id: string
    title: string
    type: QuestionType
    isNecessarily: boolean
    isFreeAnswer: boolean
}

interface QuestionWithAnswers extends Question {
    answerVariants: AnswerVariant[]
}

interface QuestionWithRating extends Question {
    maxValue: number
    leftBorder: string
    rightBorder: string
}

interface AnswerVariant {
    id: string
    title: string
}

export {
    FirebaseSurveyData,
    Survey,
    SurveyData,
    QuestionGroup,
    QuestionType,
    Question,
    QuestionWithAnswers,
    QuestionWithRating,
    AnswerVariant,
    SurveyStatus,
}

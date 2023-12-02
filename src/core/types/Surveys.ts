import { LookupField } from "./Common"

interface PlatformSurveyData {
    id: string,
    Title: string,
    Description: string,
    SurveyData: string,
    Created: number,
    Modified: number,
    User: LookupField<undefined>[],
    ImageUrl: string,
}

type RequestSurveyData = LookupField<PlatformSurveyData>

interface Route {
    conditions: Record<string, boolean>[],
    path: string,
}

interface Survey {
    id: string,
    title: string,
    description: string,
    data: SurveyData,
    created: number,
    modified: number,
    userId: string,
    imageUrl?: string,
}

enum SurveyStatus {
    Draft = 'DRAFT',
    Active = 'ACTIVE',
    Archive = 'ARCHIVE'
}

interface Auditory {
    id: string,
    name: string,
}

interface SurveyData {
    content: {
        questionGroups: QuestionGroup[],
        questions: Record<string, Question>,
    }
    settings: {
        routes: Route[],
        status: SurveyStatus,
        auditories: Auditory[]
    }
}

interface QuestionGroup {
    id: string,
    title: string,
    questions: string[],
}

enum QuestionType {
    SingleOption = 'SINGLE_OPTION',
    MultipleOptions = 'MULTIPLE_OPTIONS',
    SingleLineText = 'SINGLE_LINE_TEXT',
    MultipleLineText = 'MULTIPLE_LINE_TEXT',
    NumberValue = 'NUMBER_VALUE',
    DateValue = 'DATE_VALUE',
    Rating = 'RATING_VALUE'
}

interface Question {
    id: string,
    title: string,
    type: QuestionType,
    isNecessarily: boolean,
    isFreeAnswer: boolean
}

interface QuestionWithAnswers extends Question {
    answerVariants: AnswerVariant[]
}

interface QuestionWithRating extends Question {
    maxValue: number,
    leftBorder: string,
    rightBorder: string
}

interface AnswerVariant {
    id: string,
    title: string,
}

export {
    RequestSurveyData,
    Survey,
    SurveyData,
    QuestionGroup,
    QuestionType,
    Question,
    QuestionWithAnswers,
    QuestionWithRating,
    AnswerVariant,
    SurveyStatus,
    Auditory
}
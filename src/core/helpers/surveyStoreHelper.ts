import useSurveyStore from "../stores/surveyStore";
import { AnswerVariant, Question, QuestionGroup, QuestionType, QuestionWithAnswers, QuestionWithRating } from "../types/Surveys";


class SurveyStoreHelper {
    
    changeGroupTitle(newTitle: string, groupId: string) {
        const questionGroups = useSurveyStore.getState().questionGroups
        const currentGroup = questionGroups.find((questionGroup) => questionGroup.id === groupId) || { id: '', title: '', questions: [] }

        currentGroup.title = newTitle
    }

    addQuestionGroup(questionGroup: QuestionGroup) {
        const questionGroups = useSurveyStore.getState().questionGroups
        const setQuestionGroups = useSurveyStore.getState().setQuestionGroups

        setQuestionGroups([
            ...questionGroups,
            questionGroup
        ])
    }

    deleteQuestionGroup(groupId: string) {
        const questionGroups = useSurveyStore.getState().questionGroups
        const setQuestionGroups = useSurveyStore.getState().setQuestionGroups
        const questions = useSurveyStore.getState().questions

        const currentGroup = questionGroups.find((questionGroup) => questionGroup.id === groupId) || { id: '', title: '', questions: [] }

        for (const question of currentGroup.questions) {
            delete questions[question]
        }

        const newQuestionGroups = questionGroups.filter((questionGroup) => questionGroup.id !== groupId)
        setQuestionGroups(newQuestionGroups)
    }

    changeQuestionTitle(newTitle: string, questionId: string) {
        const questions = useSurveyStore.getState().questions
        questions[questionId].title = newTitle
    }

    changeQuestionType(newType: QuestionType, questionId: string) {
        const questions = useSurveyStore.getState().questions
        questions[questionId].type = newType
    }

    changeQuestionNecessarity(newNecessarity: boolean, questionId: string) {
        const questions = useSurveyStore.getState().questions
        questions[questionId].isNecessarily = newNecessarity
    }

    changeQuestionIsFreeAnswer(newIsFreeAnswer: boolean, questionId: string) {
        const questions = useSurveyStore.getState().questions
        questions[questionId].isFreeAnswer = newIsFreeAnswer
    }

    addQuestion(question: Question, groupId: string) {
        const questionGroups = useSurveyStore.getState().questionGroups

        const currentGroup = questionGroups.find((questionGroup) => questionGroup.id === groupId)
        currentGroup?.questions.push(question.id)

        const questions = useSurveyStore.getState().questions
        const setQuestions = useSurveyStore.getState().setQuestions

        setQuestions({
            ...questions,
            [question.id]: question
        })
    }

    addAnswerToQuestion(answer: AnswerVariant, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithAnswers = questions[questionId] as QuestionWithAnswers
        if (!questionWithAnswers.answerVariants) {
            questionWithAnswers.answerVariants = []
        }
        questionWithAnswers.answerVariants.push(answer)
    }

    changeAnswerTitle(newTitle: string, answerId: string, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithAnswers = questions[questionId] as QuestionWithAnswers
        const currentAnswer = questionWithAnswers.answerVariants.find((answer) => answer.id === answerId) || { id: '', title: '' }
        currentAnswer.title = newTitle
    }

    deleteAnswerFromQuestion(answerId: string, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithAnswers = questions[questionId] as QuestionWithAnswers
        if (questionWithAnswers.answerVariants) {
            const newquestionWithAnswersAnswers = structuredClone(questionWithAnswers.answerVariants)
            questionWithAnswers.answerVariants = newquestionWithAnswersAnswers.filter((answer) => answer.id !== answerId)
        }
    }

    deleteQuestion(groupId: string, questionId: string) {
        const questionGroups = useSurveyStore.getState().questionGroups
        const questions = useSurveyStore.getState().questions
        const setQuestions = useSurveyStore.getState().setQuestions

        const currentGroup = questionGroups.find((questionGroup) => questionGroup.id === groupId) || { id: '', title: '', questions: [] }
        currentGroup.questions = currentGroup.questions.filter((question) => question !== questionId)

        delete questions[questionId]
        const newQuestions = structuredClone(questions)
        setQuestions(newQuestions)
    }

    changeQuestionWithRatingMaxValue(newMaxValue: number, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithRating = questions[questionId] as QuestionWithRating
        questionWithRating.maxValue = newMaxValue
    }

    changeQuestionWithRatingRightBorder(newRightBorder: string, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithRating = questions[questionId] as QuestionWithRating
        questionWithRating.rightBorder = newRightBorder
    }

    changeQuestionWithRatingLeftBorder(newLeftBorder: string, questionId: string) {
        const questions = useSurveyStore.getState().questions
        const questionWithRating = questions[questionId] as QuestionWithRating
        questionWithRating.leftBorder = newLeftBorder
    }
}

export default new SurveyStoreHelper()
import { utils, CellObject, writeFile } from "xlsx"
import SurveysApi from "../api/surveysApi"
import surveyHelper from "./surveyHelper"
import { Question, QuestionType, QuestionWithAnswers } from "../types/Surveys"
import ResultsApi from "../api/resultsApi"
import resultHelper from "./resultHelper"
import { Result } from "../types/Result"

type ExcelRow = CellObject[]

class ExcelHelper {
    private getAnswerValueFromSingleOptionAnswerId(
        question: QuestionWithAnswers, answerId: string
    ): string {
        return question.answerVariants.find((questionAnswer) => questionAnswer.id === answerId)?.title || answerId
    }

    private getAnswerValuesFromMultipleOptionAnswerIds(
        question: QuestionWithAnswers, answerIds: string[]
    ): string {
        let result = ''
        answerIds.forEach((answerId) => {
            if (answerId !== '') {
                result += `${question.answerVariants.find((questionAnswer) => questionAnswer.id === answerId)?.title || answerId};`
            }
        })

        return result
    }

    private getDateAsString(date: Date): string {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }

    getHeaderRowFromSurveyQuestions(questions: Record<string, Question>): ExcelRow {
        const result: ExcelRow = [{ t: 's', v: 'Пользователь' }]
        Object.values(questions).forEach((value) => {
            result.push({ t:'s', v: value.title })
        })

        return result
    }

    getRowFromResult(questions: Record<string, Question>, surveyResult: Result): ExcelRow {
        const result: ExcelRow = [{ t: 's', v: surveyResult.userDisplayName }]
        surveyResult.data.answers.forEach((answer) => {
            const question = questions[answer.questionId]

            switch(question.type) {
                case QuestionType.SingleOption:
                    result.push({ t: 's', v: this.getAnswerValueFromSingleOptionAnswerId(
                        question as QuestionWithAnswers, answer.answer
                    )})
                    break
                case QuestionType.MultipleOptions:
                    result.push({ t: 's', v: this.getAnswerValuesFromMultipleOptionAnswerIds(
                        question as QuestionWithAnswers, answer.answer.split(';')
                    )})
                    break
                case QuestionType.SingleLineText:
                    result.push({ t: 's', v: answer.answer })
                    break
                case QuestionType.MultipleLineText:
                    result.push({ t: 's', v: answer.answer.replace('\n', ' ') })
                    break
                case QuestionType.NumberValue:
                    result.push({ t: 'n', v: Number(answer.answer) })
                    break
                case QuestionType.DateValue:
                    const date = new Date(Number(answer.answer))
                    result.push({ t: 's', v: this.getDateAsString(date) })
                    break
            }
        })

        return result
    }

    async exportSurveyResults(surveyId: string): Promise<boolean> {
        const resultsResponse = await ResultsApi.getResults()
        if (!resultsResponse.success) return false
        const resultsData = resultsResponse.data

        const surveyResponse = await SurveysApi.getSurveyById(surveyId)
        if (!surveyResponse.success) return false
        const surveyData = surveyResponse.data

        const surveyResults = resultsData
            .filter((resultData) => resultData.data.Survey[0].id === surveyId)
            .map((resultData) => resultHelper.parseRequestResultData(resultData))
        const survey = surveyHelper.parseRequestSurveyData(surveyData)
        const questions = survey.data.content.questions
        
        const excelCells: ExcelRow[] = [this.getHeaderRowFromSurveyQuestions(questions)]
        surveyResults.forEach((surveyResult) => {
            excelCells.push(this.getRowFromResult(questions, surveyResult))
        })

        const workBook = utils.book_new()
        const worksheet = utils.aoa_to_sheet(excelCells)
        utils.book_append_sheet(workBook, worksheet)

        writeFile(workBook, `Результаты опроса '${survey.title}'.xlsx`)
        return true
    }
}

export default new ExcelHelper()
import useResultsStore from "../stores/resultsStore"
import { Answer } from "../types/Result"


class ResultStoreHelper {
    changeAnswerValue(newValue: string, questionId: string, isFreeAnswer?: boolean) {
        const resultData = useResultsStore.getState().resultData

        const currentAnswer = resultData.answers.find((answer) => answer.questionId === questionId) || { questionId: '', answer: '', isFreeAnswer: isFreeAnswer || false }
        currentAnswer.answer = newValue
    }
}

export default new ResultStoreHelper()
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SURVEYS_LIST?: string
            SURVEY_RESULTS_LIST?: string
            DEFAULT_IMAGE_URL?: string
        }
    }
}

export {}
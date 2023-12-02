interface User {
    id: string,
    username: string,
    displayName: string,
    department: {
        id: string,
        displayName: string
    }
    groups: Array<{
        id: string,
        displayName: string
    }>,
    roles: Array<{
        id: string,
        displayName: string,
        name: string
    }>
}

enum UserRole {
    SurveysAdmin = 'SURVEYS_ADMIN',
    CommonUser = 'COMMON_USER'
}

export {
    User,
    UserRole,
}
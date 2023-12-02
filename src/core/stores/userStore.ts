import { create } from 'zustand'
import { User, UserRole } from '../types/User'
// TODO: delete if not neeeded
const initialData: UserStoreValues = {
    userData: {
        id: '', 
        username: '',
        displayName: '',
        department: { id: '', displayName: '' },
        groups: [],
        roles: [],
    },
    userRole: UserRole.CommonUser
}

interface UserStoreValues {
    userData: User,
    userRole: UserRole,
}

interface UserStoreActions {
    setUserData: (userData: User) => void,
    setUserRole: (userRole: UserRole) => void
}

const useUserStore = create<UserStoreValues & UserStoreActions>(((set) => ({
    ...initialData,
    setUserData: (userData: User) => set(() => (
        {
            userData: userData
        }
    )),
    setUserRole: (userRole: UserRole) => set(() => (
        {
            userRole: userRole
        }
    ))
})))

export default useUserStore
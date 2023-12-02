import { create } from 'zustand'
import { Auditory } from '../types/Surveys'

const initialData: AuditoryStoreValues = {
    auditories: []
}

interface AuditoryStoreValues {
    auditories: Auditory[]
}

interface AuditoryStoreActions {
    setAuditories: (auditories: Auditory[]) => void
}

const useAuditoryStore = create<AuditoryStoreValues & AuditoryStoreActions>(((set) => ({
    ...initialData,
    setAuditories: (auditories: Auditory[]) => set(() => (
        {
            auditories: auditories
        }
    ))
})))

export default useAuditoryStore
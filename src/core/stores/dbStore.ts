import { Firestore } from 'firebase/firestore/lite'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const initialData: DbStoreValues = {}

interface DbStoreValues {
    db?: Firestore
}

interface DbStoreActions {
    setDb: (db: Firestore) => void
}

const useDb = create<DbStoreValues & DbStoreActions>()(
    devtools((set) => ({
        ...initialData,
        setDb: (db: Firestore) =>
            set(() => ({
                db: db,
            })),
    }))
)

export default useDb

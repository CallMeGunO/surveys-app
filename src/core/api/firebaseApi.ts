import useDb from '../stores/dbStore'
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite'
import type { ApiResponse, FirebaseData } from '../types/Common'

class FirebaseApi {
    static async getListItems(listName: string): Promise<ApiResponse<unknown>> {
        try {
            const { db } = useDb.getState()
            if (db) {
                const list = collection(db, listName)
                const listSnapshot = await getDocs(list)
                const listItems = listSnapshot.docs.map((doc) => doc.data())

                return { data: listItems, success: true }
            } else {
                throw new Error('Database is not found')
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false,
            }
        }
    }

    static async getListItemById(listName: string, itemId: string): Promise<ApiResponse<unknown>> {
        try {
            const { db } = useDb.getState()
            if (db) {
                const listItemSnapshot = await getDoc(doc(db, listName, itemId))
                const listItemData = listItemSnapshot.data()

                if (listItemData) {
                    return { data: listItemSnapshot.data(), success: true }
                } else {
                    throw new Error(`${listName} with id ${itemId} is not found`)
                }
            } else {
                throw new Error('Database is not found')
            }
        } catch (error) {
            console.error(error)
            return {
                error: error,
                success: false,
            }
        }
    }

    static async createListItem(listName: string, item: FirebaseData): Promise<ApiResponse<boolean>> {
        try {
            const { db } = useDb.getState()
            if (db) {
                await setDoc(doc(db, listName, item.id), item)
                return {
                    data: true,
                    success: true,
                }
            } else {
                throw new Error('Database is not found')
            }
        } catch (error) {
            console.error(error)
            return {
                error: error,
                success: false,
            }
        }
    }

    static async updateListItem(listName: string, item: FirebaseData): Promise<ApiResponse<boolean>> {
        try {
            const { db } = useDb.getState()
            if (db) {
                const itemRef = doc(db, listName, item.id)
                await updateDoc(itemRef, { ...item })
                return {
                    data: true,
                    success: true,
                }
            } else {
                throw new Error('Database is not found')
            }
        } catch (error) {
            console.error(error)
            return {
                error: error,
                success: false,
            }
        }
    }

    static async deleteListItemById(listName: string, itemId: string): Promise<ApiResponse<boolean>> {
        try {
            const { db } = useDb.getState()
            if (db) {
                await deleteDoc(doc(db, listName, itemId))
                return {
                    data: true,
                    success: true,
                }
            } else {
                throw new Error('Database is not found')
            }
        } catch (error) {
            console.error(error)
            return {
                error: error,
                success: false,
            }
        }
    }
}

export default FirebaseApi

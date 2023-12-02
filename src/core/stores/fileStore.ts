import { create } from 'zustand'

const initialData: FileStoreValues = {
    attachmentPermissions: {},
    directoryId: '',
    rootDirectoryId: ''
}

interface FileStoreValues {
    attachmentPermissions: object,
    directoryId: string,
    rootDirectoryId: string,
}

interface FileStoreActions {
    setAttachmentPermissions: (attachmentPermissions: object) => void,
    setDirectoryId: (directoryId: string) => void,
    setRootDirectoryId: (rootDirectoryId: string) => void,

    setStore: (attachmentPermissions: object, directoryId: string, rootDirectoryId: string) => void
}



const useFileStore = create<FileStoreValues & FileStoreActions>(((set) => ({
    ...initialData,

    setAttachmentPermissions: (attachmentPermissions: object) => set(() => (
        {
            attachmentPermissions: attachmentPermissions
        }
    )),
    setDirectoryId: (directoryId: string) => set(() => (
        {
            directoryId: directoryId
        }
    )),
    setRootDirectoryId: (rootDirectoryId: string) => set(() => (
        {
            rootDirectoryId: rootDirectoryId
        }
    )),
    setStore: (attachmentPermissions: object, directoryId: string, rootDirectoryId: string) => set(() => (
        {
            attachmentPermissions: attachmentPermissions,
            directoryId: directoryId,
            rootDirectoryId: rootDirectoryId
        }
    ))
        
})))

export default useFileStore
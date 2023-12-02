import React, { useEffect, useRef, useState } from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import SurveysApi from '../../core/api/surveysApi'
import { Input, CheckPicker, Uploader } from 'rsuite'
import surveyHelper from '../../core/helpers/surveyHelper'
import QuestionGroup from '../../components/QuestionGroup/QuestionGroup'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'
import useAppRouteStore, { AppRoute } from '../../core/stores/appRouteStore'
import { Auditory, QuestionType, RequestSurveyData, SurveyStatus } from '../../core/types/Surveys'
import UsersApi from '../../core/api/usersApi'
import DepartmentsApi from '../../core/api/departmentsApi'
import RoleGroupsApi from '../../core/api/roleGroupsApi'
import useAuditoryStore from '../../core/stores/auditoryStore'
import { ApiResponse, Attachment, CheckPickerItem } from '../../core/types/Common'
import useUserStore from '../../core/stores/userStore'
import { FileType, UploaderInstance } from 'rsuite/esm/Uploader/Uploader'
import useFileStore from '../../core/stores/fileStore'
import PlatformApi from '../../core/api/platformApi'
import messageHelper from '../../core/helpers/messageHelper'
import PageHeader from '../../components/PageHeader/PageHeader'
import ButtonWithIcon from '../../components/ButtonWithIcon/ButtonWithIcon'
import { EditIcon, AcceptIcon, SaveIcon, CancelIcon } from '@fluentui/react-icons-mdl2'
import QuestionGroupPicker from '../../components/QuestionGroupPicker/QuestionGroupPicker'

import styles from './SurveyPage.css'
import './SurveyPageStaticStyles.css'

const SurveyPage: React.FC = () => {
    const [surveyTitle, setSurveyTitle] = useState<string>('Заголовок опроса')
    const [surveyDescription, setSurveyDescription] = useState<string>('')
    const [serviceData, setServiceData] = useState<object>()
    const [surveyAuditory, setSurveyAuditory] = useState<Auditory[]>([])
    const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false)

    const { setStore: setSurveyStore, questionGroups, questions, imageUrl, setImageUrl } = useSurveyStore()
    const { appRoute, setRoute, surveyId, setSurveyId } = useAppRouteStore()
    const { auditories, setAuditories } = useAuditoryStore()
    const { userData } = useUserStore()
    const { attachmentPermissions, directoryId, rootDirectoryId, setStore: setFileStore } = useFileStore()

    const uploaderRef = useRef<UploaderInstance>()
    const [uploadAction, setUploadAction] = useState<string>('')
    const [attachedImage, setAttachedImage] = useState<Attachment>()

    const [isImageSelected, setIsImageSelected] = useState(false)
    const [currentQuestionGroupId, setCurrentQuestionGroupId] = useState<string>()

    useEffect(() => {
        if (uploadAction !== '' && appRoute === AppRoute.New) {
            handleStartImageUpload()
        }
    }, [uploadAction])

    useEffect(() => {
        const fetchAuditories = async () => {
            const newAuditories: Auditory[] = []

            const usersResponse = await UsersApi.getUsers()
            if (!usersResponse.success) {
                messageHelper.pushMessage(usersResponse.error, 'error')
                return
            }
            usersResponse.data
                .map((user) => ({ id: user.id, name: user.username } as Auditory))
                .forEach((userAuditory) => newAuditories.push(userAuditory))

            const departmentsResponse = await DepartmentsApi.getDepartments()
            if (!departmentsResponse.success) {
                messageHelper.pushMessage(departmentsResponse.error, 'error')
                return
            }
            departmentsResponse.data
                .map((department) => ({ id: department.id, name: department.displayName } as Auditory))
                .forEach((departmentAuditory) => newAuditories.push(departmentAuditory))

            const roleGroupsResponse = await RoleGroupsApi.getRoleGroups()
            if (!roleGroupsResponse.success) {
                messageHelper.pushMessage(roleGroupsResponse.error, 'error')
                return
            }
            roleGroupsResponse.data
                .map((roleGroup) => ({ id: roleGroup.id, name: roleGroup.displayName } as Auditory))
                .forEach((roleGroupsAuditory) => newAuditories.push(roleGroupsAuditory))

            setAuditories(newAuditories)
        }

        const fetchSurvey = async () => {
            if (appRoute === AppRoute.New) {
                setSurveyStore({
                    id: surveyId,
                    title: '',
                    description: '',
                    userId: '',
                    questionGroups: [],
                    questions: {},
                    auditories: [],
                    status: SurveyStatus.Draft,
                    imageUrl: '',
                    created: new Date().getDate(),
                    modified: new Date().getDate(),
                })

                const initialQuestionGroupId = crypto.randomUUID()
                surveyStoreHelper.addQuestionGroup({
                    id: initialQuestionGroupId,
                    questions: [],
                    title: 'Название группы',
                })
                surveyStoreHelper.addQuestion(
                    {
                        id: crypto.randomUUID(),
                        isFreeAnswer: false,
                        isNecessarily: false,
                        title: '',
                        type: QuestionType.SingleOption,
                    },
                    initialQuestionGroupId
                )
                setCurrentQuestionGroupId(initialQuestionGroupId)
            } else if (appRoute === AppRoute.Edit) {
                const surveyDataResponse = await SurveysApi.getSurveyById(surveyId)
                if (!surveyDataResponse.success) {
                    messageHelper.pushMessage(surveyDataResponse.error, 'error')
                    return
                }
                const survey = surveyHelper.parseRequestSurveyData(surveyDataResponse.data)

                setServiceData(surveyDataResponse.data.serviceData)
                setSurveyTitle(survey.title)
                setSurveyDescription(survey.description)
                setSurveyAuditory(survey.data.settings.auditories)
                setCurrentQuestionGroupId(survey.data.content.questionGroups[0].id)

                if (surveyDataResponse.data.attachmentPermissions && surveyDataResponse.data.rootFileId) {
                    setFileStore(surveyDataResponse.data.attachmentPermissions, surveyId, surveyDataResponse.data.rootFileId)
                    updateUploadAction(surveyDataResponse.data.rootFileId, surveyId)

                    const attachmentsResponse = await PlatformApi.getDirectoryAttachments(
                        surveyDataResponse.data.rootFileId,
                        surveyId
                    )
                    if (!attachmentsResponse.success) {
                        messageHelper.pushMessage(attachmentsResponse.error, 'error')
                        return
                    }
                    if (attachmentsResponse.data.length > 0) {
                        setAttachedImage({
                            id: attachmentsResponse.data[0].id,
                            downloadLink: `/api/fs/file/${attachmentsResponse.data[0].id}`,
                        })
                        setImageUrl(`/api/fs/file/${attachmentsResponse.data[0].id}`)
                    }
                }

                setSurveyStore({
                    id: surveyId,
                    title: survey.title,
                    description: survey.description,
                    userId: survey.userId,
                    questionGroups: survey.data.content.questionGroups,
                    questions: survey.data.content.questions,
                    auditories: survey.data.settings.auditories,
                    status: survey.data.settings.status,
                    imageUrl: survey.imageUrl || '',
                    created: survey.created,
                    modified: survey.modified,
                })
            }
        }

        if (auditories.length === 0) {
            fetchAuditories()
        }
        fetchSurvey()
    }, [])

    const saveSurvey = async (status: SurveyStatus) => {
        let response: ApiResponse<RequestSurveyData>
        if (appRoute === AppRoute.Edit && serviceData) {
            response = await surveyHelper.updateSurvey(
                {
                    id: surveyId,
                    title: surveyTitle,
                    description: surveyDescription,
                    imageUrl: imageUrl,
                    created: new Date().getTime(),
                    modified: new Date().getTime(),
                    userId: userData.id,
                    data: {
                        content: {
                            questionGroups: questionGroups,
                            questions: questions,
                        },
                        settings: {
                            routes: [],
                            status: status,
                            auditories: surveyAuditory,
                        },
                    },
                },
                status,
                serviceData
            )
        } else {
            response = await surveyHelper.createSurvey(
                {
                    id: '',
                    title: surveyTitle,
                    description: surveyDescription,
                    imageUrl: imageUrl,
                    created: new Date().getTime(),
                    modified: new Date().getTime(),
                    userId: userData.id,
                    data: {
                        content: {
                            questionGroups: questionGroups,
                            questions: questions,
                        },
                        settings: {
                            routes: [],
                            status: status,
                            auditories: surveyAuditory,
                        },
                    },
                },
                status
            )
        }
        if (response.success) {
            if (appRoute === AppRoute.New) {
                setSurveyId(response.data.id)
            }
            messageHelper.pushMessage('Опрос сохранен', 'success')

            if (isImageSelected) {
                if (appRoute === AppRoute.New) {
                    if (response.data.attachmentPermissions && response.data.rootFileId) {
                        setFileStore(response.data.attachmentPermissions, response.data.id, response.data.rootFileId)
                        updateUploadAction(response.data.rootFileId, response.data.id)
                    }
                } else {
                    handleStartImageUpload()
                }
            } else {
                handleGoToMainPage()
            }
        } else {
            messageHelper.pushMessage(response.error, 'error')
        }
    }

    const getAuditoriesCheckPickerData = (): CheckPickerItem<Auditory>[] => {
        return auditories.map((auditory) => ({ value: auditory, label: auditory.name }))
    }

    const updateUploadAction = (rootDirectoryId: string, directoryId: string) => {
        setUploadAction(`/api/fs/root/${rootDirectoryId}/dir/${directoryId}/file_stringify`)
    }

    const handleSelectedImageChange = (fileList: FileType[]) => {
        const newImage = fileList.at(-1)
        if (newImage && newImage.blobFile) {
            const urlCreator = window.URL || window.webkitURL
            const newImageUrl = urlCreator.createObjectURL(newImage.blobFile)
            setImageUrl(newImageUrl)
            setIsImageSelected(true)
        }
    }

    const handleStartImageUpload = async () => {
        uploaderRef.current?.start()
    }

    const handleFinishImageUpload = async (response: { fileId: string }) => {
        if (attachedImage) {
            const deleteResponse = await PlatformApi.deleteFileFromDirectoryAttachments(
                rootDirectoryId,
                directoryId,
                attachedImage.id
            )
            if (!deleteResponse.success) {
                messageHelper.pushMessage(deleteResponse.error, 'error')
                return
            }
        }
        const surveyDataResponse = await SurveysApi.getSurveyById(surveyId)
        if (!surveyDataResponse.success) {
            messageHelper.pushMessage(surveyDataResponse.error, 'error')
            return
        }
        const updateImageUrlResponse = await SurveysApi.updateSurvey({
            id: surveyId,
            serviceData: surveyDataResponse.data.serviceData,
            data: {
                ...surveyDataResponse.data.data,
                ImageUrl: `/api/fs/file/${response.fileId}`,
            },
        })
        if (!updateImageUrlResponse.success) {
            messageHelper.pushMessage(updateImageUrlResponse.error, 'error')
            return
        }
        handleGoToMainPage()
    }

    const getImageUrl = (imageUrl: string | undefined) => {
        if (imageUrl) {
            return imageUrl
        }
        return process.env.DEFAULT_IMAGE_URL
    }

    const handleGoToMainPage = () => {
        setSurveyStore({
            id: '',
            title: '',
            description: '',
            userId: '',
            questionGroups: [],
            questions: {},
            auditories: [],
            status: SurveyStatus.Draft,
            imageUrl: '',
            created: 0,
            modified: 0,
        })
        setRoute(AppRoute.Main)
    }

    const handleSaveToDraft = () => {
        saveSurvey(SurveyStatus.Draft)
    }

    const handleSaveAndPublish = () => {
        saveSurvey(SurveyStatus.Active)
    }

    return (
        <div className={styles.container}>
            <PageHeader>
                <ButtonWithIcon icon={<CancelIcon />} onClick={handleGoToMainPage}>
                    Отменить
                </ButtonWithIcon>
                <ButtonWithIcon icon={<SaveIcon />} onClick={handleSaveToDraft}>
                    Сохранить без публикации
                </ButtonWithIcon>
                <ButtonWithIcon icon={<AcceptIcon />} onClick={handleSaveAndPublish}>
                    Опубликовать
                </ButtonWithIcon>
            </PageHeader>
            <div className={styles.surveyContainer}>
                <div
                    className={styles.title}
                    onClick={() => {
                        setIsTitleEdit(true)
                    }}
                >
                    <Input
                        placeholder="Заголовок опроса"
                        value={surveyTitle}
                        plaintext={!isTitleEdit}
                        classPrefix="survey-title"
                        autoFocus={true}
                        onChange={setSurveyTitle}
                        onBlur={() => {
                            setIsTitleEdit(false)
                        }}
                    />
                    {!isTitleEdit && <EditIcon />}
                </div>
                <div className={styles.surveyData}>
                    <div className={styles.image}>
                        <img src={getImageUrl(imageUrl)} />
                        <div className={styles.uploader}>
                            <Uploader
                                action={uploadAction}
                                autoUpload={false}
                                accept="image/png, image/jpg, image/jpeg"
                                data={{
                                    permissions: JSON.stringify(attachmentPermissions),
                                }}
                                draggable
                                onChange={handleSelectedImageChange}
                                onSuccess={handleFinishImageUpload}
                                fileListVisible={false}
                                ref={uploaderRef}
                                multiple={false}
                            >
                                <EditIcon />
                            </Uploader>
                        </div>
                    </div>
                    <div className={styles.inputs}>
                        <div className={styles.description}>
                            <span className={styles.label}>Описание опроса:</span>
                            <Input as="textarea" rows={9} value={surveyDescription} onChange={setSurveyDescription} />
                        </div>
                        <div className={styles.auditory}>
                            <span className={styles.label}>Аудитория опроса:</span>
                            <CheckPicker
                                data={getAuditoriesCheckPickerData()}
                                value={surveyAuditory}
                                onChange={(value) => {
                                    setSurveyAuditory(value)
                                }}
                                menuClassName="custom-picker"
                                block={true}
                                style={{ minWidth: '100%', maxWidth: '100%' }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.surveyContent}>
                    <QuestionGroupPicker
                        currentQuestionGroupId={currentQuestionGroupId}
                        setCurrentQuestionGroupId={setCurrentQuestionGroupId}
                        editable={true}
                    />
                    {currentQuestionGroupId && <QuestionGroup groupId={currentQuestionGroupId} />}
                </div>
            </div>
        </div>
    )
}

export default SurveyPage

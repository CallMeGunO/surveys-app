import React from 'react'
import { Message, toaster } from 'rsuite'
import { TypeAttributes } from 'rsuite/esm/@types/common'

class MessagesHelper {
    pushMessage(message: string, type?: TypeAttributes.Status) {
        toaster.push(
            <Message showIcon type={type}>
                {message}
            </Message>,
            { placement: 'topCenter' }
        )
    }
}

export default new MessagesHelper()

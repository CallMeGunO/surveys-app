import React from 'react'
import { Message, toaster } from 'rsuite'
import { TypeAttributes } from 'rsuite/esm/@types/common'

// TODO: rewrite as function instead of class with single function
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

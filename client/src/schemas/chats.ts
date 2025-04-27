import * as Yup from 'yup';

export const MessageSchema = Yup.object().shape({
    message: Yup.string()
        .required('Message cannot be empty')
        .max(500, 'Message too long')
        .trim()
})
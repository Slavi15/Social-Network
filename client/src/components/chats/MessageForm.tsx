import { Field, Form, Formik, FormikHelpers } from "formik"
import { useSendMessageMutation } from "../../redux/chats/chatsApi";
import { InputField } from "../auth/widgets/InputField";
import styles from '../../styles/components/chats/ChatsPage.module.scss'

interface MessageFormProps {
    chatId: string;
    userId: string
}

interface MessageFormValues {
    message: string;
}

const MessageForm: React.FC<MessageFormProps> = ({
    chatId,
    userId
}) => {
    const [sendMessage] = useSendMessageMutation();

    const handleSendMessage = async (
        values: MessageFormValues, 
        { resetForm }: FormikHelpers<MessageFormValues>
    ) => {
        try {
            await sendMessage({
                chatId: chatId,
                userId: userId,
                content: values.message
            }).unwrap();
            resetForm();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    return (
        <Formik
            initialValues={{
                message: ""
            }}
            onSubmit={handleSendMessage}
        >
            {({ values }) => {
                return (
                    <Form className={styles.searchForm}>
                        <Field
                            className={styles.formInput}
                            name="message"
                            component={InputField}
                            label=""
                            placeholder="Send message..."
                            type="text" />

                        <button
                            type="submit"
                            className={styles.formButton}
                        >
                            Send
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default MessageForm;
import { useEffect, useState } from "react";
import { useGetUsersByNameMutation } from "../../redux/users/usersApi";
import { Field, Form, Formik } from "formik";
import { InputField } from "../widgets/InputField";
import styles from '../../styles/components/chats/ChatsPage.module.scss'
import { IUser } from "../../redux/types/users";
import FriendInfo from "../profile/FriendInfo";

interface SearchFormProps {
    onToggle?: (user: IUser) => void;
    shouldCreateChat: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
    onToggle,
    shouldCreateChat
}) => {
    const [triggerSearch, { data: users }] = useGetUsersByNameMutation();
    const [debounce, setDebounce] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (debounce.trim() !== "") {
                triggerSearch(debounce);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [debounce, triggerSearch]);

    const handleSearch = (values: { username: string; }) => triggerSearch(values.username);

    return (
        <div className={styles.searchContainer}>
            <Formik
                initialValues={{
                    username: ""
                }}
                onSubmit={handleSearch}
            >
                {({ values }) => {
                    useEffect(() => {
                        setDebounce(values.username);
                    }, [values.username]);

                    return (
                        <Form className={styles.searchForm}>
                            <Field
                                className={styles.formInput}
                                name="username"
                                component={InputField}
                                label=""
                                placeholder="Search..."
                                type="text" />
                        </Form>
                    )
                }}
            </Formik>

            <div className={styles.searchResults}>
                {users && (
                    <>
                        {users.map((user: IUser) => (
                            <div key={user._id}
                                onClick={() => onToggle?.(user)}
                            >
                                <FriendInfo
                                    friend={user}
                                    showFriends={false}
                                    shouldCreateChat={shouldCreateChat} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
};

export default SearchForm;
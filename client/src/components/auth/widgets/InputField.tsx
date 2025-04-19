import React, { memo } from 'react';
import { ErrorMessage, FieldProps } from 'formik';
import styles from "../../../styles/components/auth/widgets/InputField.module.scss"

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'> {
    label: string;
    field: FieldProps['field'];
    form: FieldProps['form'];
}

export const InputField = memo<InputFieldProps>(({ field, form, label, ...props }) => (
    <div className={styles.formGroup}>
        <label htmlFor={field.name} className={styles.formLabel}>
            {label}
        </label>
        <input
            {...field}
            {...props}
            className={`${styles.formInput} ${form.touched[field.name] && form.errors[field.name] ? styles.error : ''}`}
        />
        <ErrorMessage name={field.name}>
            {(msg) => <div className={styles.formError}>{msg}</div>}
        </ErrorMessage>
    </div>
));
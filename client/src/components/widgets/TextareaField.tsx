import React, { memo } from 'react';
import { ErrorMessage, FieldProps } from 'formik';
import styles from "../../styles/components/auth/widgets/Field.module.scss"

interface TextareaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'form'> {
    label: string;
    field: FieldProps['field'];
    form: FieldProps['form'];
}

export const TextareaField = memo<TextareaFieldProps>(({ field, form, label, ...props }) => (
    <div className={styles.formGroup}>
        <label htmlFor={field.name} className={styles.formLabel}>
            {label}
        </label>
        <textarea
            {...field}
            {...props}
            className={`${styles.formTextarea} ${form.touched[field.name] && form.errors[field.name] ? styles.error : ''}`}
        />
        <ErrorMessage name={field.name}>
            {(msg) => <div className={styles.formError}>{msg}</div>}
        </ErrorMessage>
    </div>
));
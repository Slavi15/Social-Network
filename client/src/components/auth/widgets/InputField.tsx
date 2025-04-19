import React, { memo } from 'react';
import { ErrorMessage, FieldProps } from 'formik';

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'> {
    label: string;
    field: FieldProps['field'];
    form: FieldProps['form'];
}

export const InputField = memo<InputFieldProps>(({ field, form, label, ...props }) => (
    <div className="form-group">
        <label htmlFor={field.name} className="form-label">
            {label}
        </label>
        <input
            {...field}
            {...props}
            className={`form-input ${form.touched[field.name] && form.errors[field.name] ? 'error' : ''}`}
        />
        <ErrorMessage name={field.name}>
            {(msg) => <div className="form-error">{msg}</div>}
        </ErrorMessage>
    </div>
));
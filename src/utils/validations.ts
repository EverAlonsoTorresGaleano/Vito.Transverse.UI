import React from 'react';
import { UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TFunction } from 'i18next';
import { getCultureName } from './culture';

export const createFormSubmitHandler = <T extends Record<string, any>>(
  handleSubmit: UseFormHandleSubmit<T>,
  onSubmit: (data: T) => void | Promise<void>,
  t: TFunction,
  options?: {
    getFieldLabel?: (key: string, t: TFunction) => string;
  }
) => {
  return (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(
      (data) => {
        onSubmit(data);
      },
      (errors: FieldErrors<T>) => {
        const errorMessages = Object.entries(errors).map(([key, error]: [string, any]) => {
          let fieldName: string;
          if (options?.getFieldLabel) {
            fieldName = options.getFieldLabel(key, t);
          } else {
            fieldName = t('Label_' + key[0].toUpperCase() + key.slice(1));
          }
          
          if (key === 'nameTranslationValue' || key === 'descriptionTranslationValue') {
            const message = error?.message || t('Validation_Input_Required');
            return `${t('Label_NameTranslationValue', { cultureName: getCultureName() })}: ${message}`;
          } else {
            const message = error?.message || t('Validation_Input_Required');
            return `${fieldName}: ${message}`;
          }
        });
        toast.error(
          React.createElement(
            'div',
            null,
            React.createElement('strong', null, t('Validation_Required_Fields')),
            React.createElement(
              'ul',
              { style: { margin: '8px 0 0 0', paddingLeft: '20px' } },
              errorMessages.map((msg, idx) =>
                React.createElement('li', { key: idx }, msg)
              )
            )
          ),
          {
            autoClose: 5000,
          }
        );
      }
    )(e);
  };
};


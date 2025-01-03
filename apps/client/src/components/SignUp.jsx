import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSignUp } from '../hooks/queries/use-auth';

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const signup = useSignUp();

  const { t } = useTranslation('signup-form');
  const password = watch('password');

  const submitForm = async (data) => {
    await signup.mutateAsync(data);
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">DramaSphere</h1>
      <form className="auth-form" onSubmit={handleSubmit(submitForm)}>
        <label htmlFor="email">{t('email')}</label>
        <input
          {...register('email', {
            required: t('validation.emailRequired'),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: t('validation.emailInvalid')
            }
          })}
          id="email"
          type="email"
          placeholder={t('email')}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <label htmlFor="password">{t('password')}</label>
        <input
          {...register('password', {
            required: t('validation.passwordRequired'),
            minLength: {
              value: 6,
              message: t('validation.passwordLength')
            }
          })}
          id="password"
          type="password"
          placeholder={t('password')}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
        <input
          {...register('confirmPassword', {
            required: t('validation.confirmRequired'),
            validate: (value) =>
              value === password || t('validation.passwordsMatch')
          })}
          id="confirmPassword"
          type="password"
          placeholder={t('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={signup.isPending}
        >
          {signup.isPending ? t('signingUp') : t('signUp')}
        </button>
      </form>
    </div>
  );
}

export default SignUp;

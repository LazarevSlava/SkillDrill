import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormValues = {
  email: string;
  password: string;
  username?: string;
};

export default function RegisterForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(`${mode.toUpperCase()} DATA:`, data);
    // TODO: send data to backend depending on mode
  };

  const handleOAuth = (provider: string) => {
    console.log(`Redirect to ${provider} OAuth`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg ${
            mode === 'signin' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setMode('signin')}
        >
          Sign In
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${
            mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={() => handleOAuth('google')}
          className="py-2 px-4 border rounded-lg hover:bg-gray-100"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth('github')}
          className="py-2 px-4 border rounded-lg hover:bg-gray-100"
        >
          Continue with GitHub
        </button>
        <button
          onClick={() => handleOAuth('apple')}
          className="py-2 px-4 border rounded-lg hover:bg-gray-100"
        >
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
          className="border px-4 py-2 rounded-lg"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              className="border px-4 py-2 rounded-lg"
            />
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register('password', {
            required: 'Password is required',
          })}
          className="border px-4 py-2 rounded-lg"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {mode === 'signup' ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

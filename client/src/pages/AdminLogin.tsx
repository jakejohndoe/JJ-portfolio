// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use the full URL to your backend API
      const response = await fetch('https://hellojakejohn.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        // Add credentials if your API uses cookies for authentication
        credentials: 'include'
      });
      
      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Check API endpoint.');
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }
      
      // Store token and user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(result));
      
      // Log successful login for debugging
      console.log('Login successful, user info stored:', result);
      
      // Redirect to admin dashboard
      setLocation('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Authentication failed. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-input'}`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-input'}`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
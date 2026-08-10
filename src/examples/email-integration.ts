/**
 * Frontend Email Integration Examples
 *
 * These examples show how moor-hall-ui communicates with the
 * backend email endpoints. Use these as reference for your forms.
 */

// ============================================================
// 1. CONTACT FORM - Send contact email to admin + auto-reply
// ============================================================

// src/services/api.ts (or wherever your API client lives)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1';

const apiClient = async (endpoint: string, method: string = 'GET', body?: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Add auth token if needed:
      // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Contact form submission
export const submitContactForm = async (formData: {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  return apiClient('/emails/contact', 'POST', formData);
};

// ============================================================
// 2. FORGOT PASSWORD - Request password reset email
// ============================================================

export const requestPasswordReset = async (email: string) => {
  return apiClient('/emails/forgot-password', 'POST', { email });
};

// ============================================================
// 3. WELCOME EMAIL - Trigger after registration
// ============================================================

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  return apiClient('/emails/welcome', 'POST', { email, fullName });
};

// ============================================================
// 4. CONTACT FORM - React/React Hook Form Example
// ============================================================

/*
// src/components/ContactForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactForm(data);
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-green-800 font-bold">Message Sent!</h3>
        <p className="text-green-700 mt-2">
          Your message has been sent. You'll receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
        <input
          id="fullName"
          {...register('fullName')}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone (optional)</label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="+1 234 567 890"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
        <input
          id="subject"
          {...register('subject')}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="How can we help?"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="mt-1 w-full px-4 py-2 border rounded-md"
          placeholder="Tell us how we can help..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md
                   hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
*/

// ============================================================
// 5. FORGOT PASSWORD - Axios Example
// ============================================================

/*
// src/services/authApi.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request password reset email
export const forgotPassword = async (email: string) => {
  const response = await api.post('/emails/forgot-password', { email });
  return response.data;
  // Returns: { success: true, message: 'If an account with that email exists...' }
};

// This can be used in your ForgotPassword component:
//
// const handleSubmit = async (email: string) => {
//   try {
//     await forgotPassword(email);
//     // Show success message (don't reveal if email exists)
//     alert('If an account exists with that email, a reset link has been sent.');
//   } catch (error) {
//     alert('Something went wrong. Please try again.');
//   }
// };
*/

// ============================================================
// 6. EMAIL HEALTH CHECK - Admin dashboard example
// ============================================================

/*
// src/services/adminApi.ts
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api/v1',
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check email service health (admin only)
export const checkEmailHealth = async () => {
  const response = await api.get('/emails/health');
  return response.data;
  // Returns: {
  //   success: true,
  //   data: {
  //     primary: true,
  //     fallback: true,
  //   }
  // }
};
*/

console.log('Email integration examples loaded');
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call - replace with actual submission logic
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the data to your backend here
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="flex items-center gap-2 mb-2 font-medium text-[rgb(var(--color-text-base))]">
            <User className="w-4 h-4" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[rgb(var(--color-bg-base))] border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] ${
              errors.name ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
            }`}
            placeholder="Your name"
          />
          {errors.name && (
            <motion.p
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium text-[rgb(var(--color-text-base))]">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[rgb(var(--color-bg-base))] border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] ${
              errors.email ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <motion.p
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="flex items-center gap-2 mb-2 font-medium text-[rgb(var(--color-text-base))]">
            <MessageSquare className="w-4 h-4" />
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[rgb(var(--color-bg-base))] border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] ${
              errors.subject ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
            }`}
            placeholder="What's this about?"
          />
          {errors.subject && (
            <motion.p
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.subject}
            </motion.p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="flex items-center gap-2 mb-2 font-medium text-[rgb(var(--color-text-base))]">
            <MessageSquare className="w-4 h-4" />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 bg-[rgb(var(--color-bg-base))] border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] resize-none ${
              errors.message ? 'border-red-500' : 'border-[rgb(var(--color-border))]'
            }`}
            placeholder="Tell me about your project or inquiry..."
          />
          {errors.message && (
            <motion.p
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-3 h-3" />
              {errors.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </motion.button>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <motion.div
            className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-500 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700 dark:text-green-300">
              Thank you! Your message has been sent successfully. I'll get back to you soon.
            </p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-500 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">
              Oops! Something went wrong. Please try again or email me directly.
            </p>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
}

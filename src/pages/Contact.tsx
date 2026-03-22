import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-6 text-center">Contact Support</h1>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Thank you!</h2>
            <p className="text-stone-600 text-lg">We will contact you soon.</p>
          </div>
        ) : (
          <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Name *</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-stone-700 mb-2">Age</label>
                <input type="number" id="age" name="age" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Your age" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="your@email.com" />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
              <input type="text" id="subject" name="subject" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="How can we help?" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Message *</label>
              <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="Your message..."></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

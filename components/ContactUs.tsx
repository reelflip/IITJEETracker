import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';

export const ContactUs: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construct mailto link for default email client
        const subject = encodeURIComponent(`Contact Request from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:innfriend1@gmail.com?subject=${subject}&body=${body}`;
        
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto bg-white p-12 rounded-2xl shadow-xl border border-gray-200 text-center animate-in zoom-in-95">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">
                    Your default email client should have opened. If not, please email us directly at <br/>
                    <strong className="text-bt-blue">innfriend1@gmail.com</strong>
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="text-bt-blue font-bold hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900 p-8 text-white text-center">
                <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
                <p className="text-slate-300">Have questions or feedback? We're here to help.</p>
            </div>
            
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea 
                                required
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={5}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none transition-all resize-none"
                                placeholder="How can we help you?"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-bt-blue hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-transform transform active:scale-95"
                    >
                        <Send size={20} /> Send Message
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                    <p>Or email us directly at <a href="mailto:innfriend1@gmail.com" className="text-bt-blue font-bold hover:underline">innfriend1@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
};
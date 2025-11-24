
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { contentService } from '../services/contentService';
import { Calendar, Clock, User, ArrowLeft, Tag, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const BlogPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

    useEffect(() => {
        setBlogs(contentService.getBlogs());
    }, []);

    // --- SINGLE POST VIEW ---
    if (selectedBlog) {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setSelectedBlog(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Articles
                </button>

                <article className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {selectedBlog.imageUrl && (
                        <div className="w-full h-64 md:h-96 overflow-hidden relative">
                            <img 
                                src={selectedBlog.imageUrl} 
                                alt={selectedBlog.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <span className="px-3 py-1 rounded-full bg-blue-600 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                                    {selectedBlog.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight text-shadow-sm">{selectedBlog.title}</h1>
                            </div>
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {!selectedBlog.imageUrl && (
                            <div className="mb-8 border-b pb-6">
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                                    {selectedBlog.category}
                                </span>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span className="font-medium text-gray-900">{selectedBlog.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{selectedBlog.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{selectedBlog.readTime}</span>
                            </div>
                        </div>

                        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                            <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Insights & Strategy</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Expert advice, success stories, and mental health tips to keep you on track for JEE success.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
                        <BookOpen className="mx-auto mb-4 opacity-50" size={48} />
                        <p className="text-lg font-medium">No articles published yet.</p>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div 
                            key={blog.id} 
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
                            onClick={() => setSelectedBlog(blog)}
                        >
                            <div className="h-48 overflow-hidden relative bg-gray-100">
                                {blog.imageUrl ? (
                                    <img 
                                        src={blog.imageUrl} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-gray-800 shadow-sm">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <Calendar size={12} /> {blog.date}
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <Clock size={12} /> {blog.readTime}
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                    {blog.excerpt}
                                </p>
                                
                                <div className="text-blue-600 text-sm font-bold flex items-center gap-1 mt-auto group-hover:gap-2 transition-all">
                                    Read Article <ArrowLeft size={16} className="rotate-180" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

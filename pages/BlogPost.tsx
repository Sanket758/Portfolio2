
import React, { useState, useEffect } from 'react';
import type { Blog } from '../types';
import { getDocumentsByField } from '../firebase/firestoreService';
import Footer from '../components/Footer';

const BlogPost: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const slug = window.location.pathname.split('/blog/')[1];
        if (!slug) {
          setError('Blog post not found.');
          setLoading(false);
          return;
        }
        
        const data = await getDocumentsByField<Blog>('blogs', 'slug', slug);
        
        if (data.length > 0) {
          setBlog(data[0]);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load the blog post.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  const renderContent = (content: string) => {
    return content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
        <p key={index} className="mb-6 text-lg leading-relaxed text-text-secondary">
            {paragraph}
        </p>
    ));
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans">
      <header className="bg-secondary">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 flex justify-between items-center">
          <a href="/#home" className="text-2xl font-bold text-text-primary hover:text-accent transition-colors">
            Sanket Gadge
          </a>
          <a href="/#blogs" className="text-text-secondary hover:text-accent transition-colors font-medium">
            &larr; Back to Blog
          </a>
        </div>
      </header>
      
      <main className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        {loading && <p className="text-center">Loading post...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {blog && (
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-center">{blog.title}</h1>
            <p className="text-center text-text-secondary mb-8">
              Published on {new Date(blog.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-12" />
            <div className="prose prose-invert max-w-none">
              {renderContent(blog.content)}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

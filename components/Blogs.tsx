
import React, { useState, useEffect } from 'react';
import type { Blog } from '../types';
import { getCollection } from '../firebase/firestoreService';

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <a href={`/blog/${blog.slug}`} className="block bg-secondary rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 group">
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <p className="text-sm text-text-secondary mb-2">{new Date(blog.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">{blog.title}</h3>
        <p className="text-text-secondary mb-4 h-24 overflow-hidden">{blog.summary}</p>
        <span className="font-semibold text-accent">Read More &rarr;</span>
      </div>
    </a>
  );
};

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getCollection<Blog>('blogs');
      // Sort blogs by published date, most recent first
      data.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <section id="blogs" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12">
        Latest Posts
      </h2>
      {loading ? (
        <p className="text-center text-text-secondary">Loading posts...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Blogs;

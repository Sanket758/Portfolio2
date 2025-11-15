
import React, { useState, useEffect } from 'react';
import type { Blog } from '../../types';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../../firebase/firestoreService';
import Modal from './Modal';
import { PlusIcon, TrashIcon, PencilIcon } from '../icons';

const EMPTY_BLOG_STATE: Partial<Blog> = {
  title: '',
  slug: '',
  imageUrl: '',
  summary: '',
  content: '',
  publishedDate: new Date().toISOString().split('T')[0], // Default to today
};

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>(EMPTY_BLOG_STATE);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await getCollection<Blog>('blogs');
    data.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setIsEditing(true);
      setCurrentBlog(blog);
    } else {
      setIsEditing(false);
      setCurrentBlog(EMPTY_BLOG_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentBlog(EMPTY_BLOG_STATE);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'title' && !isEditing) {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        setCurrentBlog(prev => ({ ...prev, title: value, slug }));
    } else {
        setCurrentBlog(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentBlog.id) {
        await updateDocument('blogs', currentBlog.id, currentBlog);
    } else {
        await addDocument('blogs', currentBlog);
    }
    
    handleCloseModal();
    await fetchBlogs();
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
        await deleteDocument('blogs', id);
        await fetchBlogs();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Blog Posts</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2"
        >
          <PlusIcon /> Add Post
        </button>
      </div>

      <div className="bg-secondary p-4 rounded-lg shadow-lg">
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id} className="border-b border-gray-800 hover:bg-primary">
                    <td className="p-4 font-medium">{blog.title}</td>
                    <td className="p-4 text-sm text-text-secondary">{blog.publishedDate}</td>
                    <td className="p-4 flex gap-4">
                      <button onClick={() => handleOpenModal(blog)} className="text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal title={isEditing ? 'Edit Post' : 'Add New Post'} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" value={currentBlog.title} onChange={handleInputChange} placeholder="Post Title" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="slug" value={currentBlog.slug} onChange={handleInputChange} placeholder="URL Slug (e.g., my-first-post)" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input name="imageUrl" value={currentBlog.imageUrl} onChange={handleInputChange} placeholder="Image URL" className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <input type="date" name="publishedDate" value={currentBlog.publishedDate} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-gray-600" required />
            <textarea name="summary" value={currentBlog.summary} onChange={handleInputChange} placeholder="Summary for blog list page" className="w-full bg-primary p-2 rounded border border-gray-600" rows={3} required></textarea>
            <textarea name="content" value={currentBlog.content} onChange={handleInputChange} placeholder="Full blog content (Markdown is supported)" className="w-full bg-primary p-2 rounded border border-gray-600" rows={10} required></textarea>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-500">Cancel</button>
              <button type="submit" className="bg-accent py-2 px-4 rounded-lg hover:bg-blue-500">{isEditing ? 'Save Changes' : 'Publish Post'}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManager;

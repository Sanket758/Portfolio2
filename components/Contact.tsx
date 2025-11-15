
import React from 'react';
import { GitHubIcon, LinkedInIcon } from './icons';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-4">
        Get In Touch
      </h2>
      <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
        I'm currently open to new opportunities and collaborations. Feel free to send me a message, and I'll get back to you as soon as possible.
      </p>
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex-1">
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full bg-secondary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-accent focus:border-accent" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full bg-secondary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-accent focus:border-accent" required />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Message</label>
                    <textarea id="message" name="message" rows={4} className="mt-1 block w-full bg-secondary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-accent focus:border-accent" required></textarea>
                </div>
                <div>
                    <button type="submit" className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Connect with me</h3>
            <div className="flex space-x-6">
                <a href="https://github.com/sanket758" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors"><GitHubIcon className="w-8 h-8" /></a>
                <a href="https://www.linkedin.com/in/sanket758/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors"><LinkedInIcon className="w-8 h-8" /></a>
            </div>
            <div className="mt-8 text-center md:text-left text-text-secondary">
              <p className="font-semibold">Email</p>
              <a href="mailto:gadgesanket75@gmail.com" className="hover:text-accent">gadgesanket75@gmail.com</a>
              <p className="font-semibold mt-4">Location</p>
              <p>Berlin, Germany</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

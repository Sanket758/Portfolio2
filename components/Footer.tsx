
import React from 'react';
import { GitHubIcon, LinkedInIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-secondary text-center md:text-left">
            &copy; {new Date().getFullYear()} Sanket Gadge. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <a href="https://github.com/sanket758" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-text-secondary hover:text-accent transition-colors"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/sanket758/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-secondary hover:text-accent transition-colors"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

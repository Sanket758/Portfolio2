
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center -mt-20">
      <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="order-2 md:order-1 flex-1">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-4">
            Sanket Gadge
          </h1>
          <p className="text-xl md:text-2xl text-accent font-semibold mb-6">
            AI & ML Engineer
          </p>
          <p className="text-lg text-text-secondary max-w-xl mx-auto md:mx-0 mb-8">
            AI & ML Engineer with 4+ years' experience designing and deploying computer vision and NLP systems. Proven record of optimizing real-world AI pipelines for scale and ensuring GDPR-compliant deployments.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#projects" className="bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
              View Projects
            </a>
            <a href="#contact" className="bg-secondary text-text-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
              Contact Me
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
            <img 
                src="https://media.licdn.com/dms/image/D4D03AQEG4yM6lpmLUQ/profile-displayphoto-shrink_400_400/0/1715077227702?e=1727913600&v=beta&t=o36jVj5B-gP1UoP3lY-X_Jt7gB7p9Z7vO9r9m9h3H_g" 
                alt="Sanket Gadge" 
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-secondary shadow-2xl"
            />
        </div>
      </div>
    </section>
  );
};

export default Hero;

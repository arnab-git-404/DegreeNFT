import React from 'react';
import { 
  GraduationCap, 
  Shield, 
  Zap, 
  Users, 
  Github, 
  Linkedin, 
  Mail,
  Code,
  Globe,
  Award,
  Lock,
  TrendingUp
} from 'lucide-react';

export function About() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Blockchain Security",
      description: "Credentials stored immutably on Solana blockchain, ensuring tamper-proof verification"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Verification",
      description: "Real-time credential verification without intermediaries or delays"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Student Control",
      description: "Students have full ownership and control of their digital credentials"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Transparent Process",
      description: "Complete transparency in credential issuance and verification"
    }
  ];

  const technologies = [
    { name: "React", description: "Modern UI framework" },
    { name: "Solana", description: "High-performance blockchain" },
    { name: "Metaplex", description: "NFT standard protocol" },
    { name: "Node.js", description: "Backend runtime" },
    { name: "MongoDB", description: "Database solution" },
    { name: "Tailwind CSS", description: "Utility-first styling" }
  ];

  const developers = [
    {
      name: "Your Name",
      role: "Full Stack Developer",
      description: "Blockchain enthusiast specializing in Web3 development and decentralized applications",
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      email: "your.email@example.com"
    }
    // Add more developers if needed
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600/20 rounded-full">
            <GraduationCap className="h-16 w-16 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          About DegreeNFT
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Revolutionizing Academic Credentials with Blockchain Technology
        </p>
      </div>

      {/* Project Description */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Award className="mr-3 h-8 w-8 text-indigo-400" />
          Project Overview
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            <span className="font-semibold text-indigo-400">DegreeNFT</span> is a cutting-edge decentralized platform 
            that transforms traditional academic credentials into secure, verifiable NFTs on the Solana blockchain. 
            Our mission is to eliminate credential fraud, streamline verification processes, and give students true 
            ownership of their academic achievements.
          </p>
          <p>
            The platform provides a comprehensive ecosystem where universities can issue digital credentials, 
            students can manage and share their achievements, and employers can instantly verify authenticity 
            without relying on intermediaries or lengthy verification processes.
          </p>
          <p>
            Built on Solana's high-performance blockchain, DegreeNFT ensures low transaction costs, near-instant 
            finality, and environmental sustainability while maintaining the highest standards of security and 
            immutability.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600/20 rounded-lg mb-4 text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Components */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Users className="mr-3 h-8 w-8 text-indigo-400" />
          Platform Components
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="text-indigo-400 font-semibold text-lg">University Dashboard</div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Batch credential upload via CSV</li>
              <li>• Student authorization management</li>
              <li>• Issue tracking and reporting</li>
              <li>• Credential lifecycle monitoring</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-indigo-400 font-semibold text-lg">Student Dashboard</div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Review credential details</li>
              <li>• Confirm or report issues</li>
              <li>• Mint NFT credentials</li>
              <li>• Manage digital certificates</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-indigo-400 font-semibold text-lg">Verification Portal</div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Instant credential verification</li>
              <li>• Blockchain-backed authenticity</li>
              <li>• Detailed credential information</li>
              <li>• Public verification access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Code className="mr-3 h-8 w-8 text-indigo-400" />
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border border-gray-700 bg-gray-800/30 hover:border-indigo-600 transition-all"
            >
              <div className="font-semibold text-white mb-1">{tech.name}</div>
              <div className="text-sm text-gray-400">{tech.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Section */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Development Team
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev, index) => (
            <div 
              key={index}
              className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 hover:border-indigo-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-indigo-600/20 rounded-full mb-4 mx-auto">
                <Users className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-1">
                {dev.name}
              </h3>
              <p className="text-indigo-400 text-sm text-center mb-3">
                {dev.role}
              </p>
              <p className="text-gray-400 text-sm text-center mb-6">
                {dev.description}
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  title="GitHub"
                >
                  <Github className="h-5 w-5 text-gray-300" />
                </a>
                <a 
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-gray-300" />
                </a>
                <a 
                  href={`mailto:${dev.email}`}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  title="Email"
                >
                  <Mail className="h-5 w-5 text-gray-300" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="rounded-lg border border-indigo-600 bg-indigo-900/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Our Vision
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
          We envision a future where academic credentials are universally accessible, instantly verifiable, 
          and completely owned by the individuals who earned them. By leveraging blockchain technology, 
          we're building a trustless system that benefits students, universities, and employers alike, 
          eliminating fraud and creating a more transparent educational ecosystem.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">
          Ready to Transform Academic Credentials?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Join us in revolutionizing how educational achievements are verified and shared in the digital age.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/contact"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors inline-flex items-center"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </a>
          <a 
            href="https://github.com/yourusername/DegreeNFT"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-700 hover:border-indigo-600 text-white rounded-lg transition-colors inline-flex items-center"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
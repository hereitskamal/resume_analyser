// app/about/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Squadra Media",
      period: "Oct 2024 – Present",
      location: "Bengaluru, India",
      description: "Leading frontend architecture for enterprise learning platforms using React, TypeScript, and GraphQL."
    },
    {
      title: "MERN Stack Developer",
      company: "Insignia Consultancy Solutions",
      period: "Jan 2024 – Oct 2024",
      location: "Remote",
      description: "Developed internal tools and e-commerce platforms with focus on modular UI and performance optimization."
    },
    {
      title: "Web Developer",
      company: "VJ Smart Living",
      period: "Jan 2022 – Dec 2023",
      location: "Bengaluru, India",
      description: "Built smart home UIs, CRM systems, and business automation tools with emphasis on user experience."
    }
  ]

  const skills = [
    "React.js", "Next.js", "TypeScript", "JavaScript", "Node.js",
    "MongoDB", "GraphQL", "Tailwind CSS", "Framer Motion", "AWS S3"
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-4xl font-light text-gray-600">KS</span>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">Kamal Sharma</h1>
          <p className="text-xl text-gray-600 font-light mb-6">Software Developer & Frontend Architect</p>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Dedicated to building robust web applications with modern JavaScript frameworks, 
            focusing on scalable, user-friendly solutions that make a difference.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center space-x-8 mb-16 text-sm text-gray-600 font-light"
        >
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>Bengaluru, Karnataka</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📞</span>
            <span>(091) 97541-77313</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✉️</span>
            <span>itskamalofficial@gmail.com</span>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-6">About Me</h2>
          <div className="space-y-4 text-gray-600 font-light leading-relaxed">
            <p>
              I&apos;m a passionate Software Developer with comprehensive experience in building robust web applications 
              using modern JavaScript frameworks. My journey in tech has been driven by a constant desire to create 
              solutions that not only meet technical requirements but also provide exceptional user experiences.
            </p>
            <p>
              With expertise spanning the entire development stack, I specialize in React, Next.js, and the MERN 
              ecosystem. I have a strong understanding of application architecture and take pride in creating 
              responsive, high-performance interfaces that users love to interact with.
            </p>
            <p>
              Beyond coding, I&apos;m committed to continuous learning and staying current with the latest technologies 
              and best practices. I believe in the power of collaboration and enjoy working with cross-functional 
              teams to bring innovative ideas to life.
            </p>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-8">Professional Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="border-l-2 border-gray-100 pl-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-500 font-light">{exp.period}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center mb-3">
                  <p className="text-gray-700 font-light">{exp.company}</p>
                  <span className="hidden md:inline text-gray-400 mx-2">•</span>
                  <p className="text-sm text-gray-500 font-light">{exp.location}</p>
                </div>
                <p className="text-gray-600 font-light leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-8">Technical Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-center hover:border-gray-200 transition-colors"
              >
                <span className="text-sm font-light text-gray-700">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-8">Education</h2>
          <div className="border-l-2 border-gray-100 pl-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bachelor&apos;s Degree in Computer Science Engineering</h3>
            <p className="text-gray-700 font-light mb-1">Rajiv Gandhi Proudyogiki Vishwavidyalaya</p>
            <p className="text-sm text-gray-500 font-light">2015 – 2019</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center border-t border-gray-100 pt-16"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-4">Let&apos;s Work Together</h2>
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in discussing new opportunities and innovative projects. 
            Whether you&apos;re looking to build something from scratch or improve an existing product, 
            I&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="mailto:itskamalofficial@gmail.com"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-light"
            >
              Get In Touch
            </Link>
            <Link
              href="/"
              className="border border-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-light"
            >
              Try Resume Analyzer
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

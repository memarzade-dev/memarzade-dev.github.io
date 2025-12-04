import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';

interface TimelineItem {
  type: 'work' | 'education' | 'achievement';
  title: string;
  organization: string;
  location?: string;
  period: string;
  description: string;
  skills?: string[];
}

const timelineData: TimelineItem[] = [
  {
    type: 'work',
    title: 'Senior Full-Stack Developer',
    organization: 'Tech Innovations Inc.',
    location: 'Remote',
    period: '2022 - Present',
    description: 'Leading development of enterprise-scale web applications using Laravel, React, and cloud technologies. Mentoring junior developers and architecting scalable solutions.',
    skills: ['Laravel', 'React', 'AWS', 'Docker', 'PostgreSQL'],
  },
  {
    type: 'achievement',
    title: 'Blockchain Developer Certification',
    organization: 'Ethereum Foundation',
    period: '2023',
    description: 'Completed advanced certification in smart contract development and DApp architecture.',
    skills: ['Solidity', 'Web3.js', 'Smart Contracts'],
  },
  {
    type: 'work',
    title: 'Full-Stack Developer',
    organization: 'Digital Solutions Ltd.',
    location: 'Hybrid',
    period: '2020 - 2022',
    description: 'Developed and maintained multiple client projects including e-commerce platforms and SaaS applications. Implemented CI/CD pipelines and DevOps practices.',
    skills: ['Node.js', 'React', 'MongoDB', 'CI/CD'],
  },
  {
    type: 'education',
    title: 'Bachelor of Computer Science',
    organization: 'University of Technology',
    location: 'Tehran',
    period: '2016 - 2020',
    description: 'Graduated with honors. Focus on software engineering, algorithms, and artificial intelligence.',
  },
  {
    type: 'achievement',
    title: 'AI & Machine Learning Specialization',
    organization: 'Coursera - Stanford University',
    period: '2021',
    description: 'Completed comprehensive specialization in machine learning, neural networks, and deep learning.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
  },
  {
    type: 'work',
    title: 'Junior Developer',
    organization: 'StartUp Ventures',
    location: 'Tehran',
    period: '2019 - 2020',
    description: 'Contributed to rapid prototyping and MVP development for various startup projects. Gained experience in agile methodologies.',
    skills: ['PHP', 'JavaScript', 'MySQL', 'Git'],
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'work':
      return <Briefcase className="w-5 h-5" />;
    case 'education':
      return <GraduationCap className="w-5 h-5" />;
    case 'achievement':
      return <Award className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'work':
      return 'bg-blue-500';
    case 'education':
      return 'bg-purple-500';
    case 'achievement':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export function Timeline() {
  return (
    <section id="experience" className="py-20 bg-[rgb(var(--color-bg-subtle))]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4">Experience & Education</h2>
          <p className="text-lg text-[rgb(var(--color-text-muted))]">
            My professional journey and achievements
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[rgb(var(--color-border))]" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative pl-20"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`absolute left-0 w-16 h-16 ${getIconColor(item.type)} rounded-full flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {getIcon(item.type)}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    className="bg-[rgb(var(--color-bg-base))] border border-[rgb(var(--color-border))] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-base))] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[rgb(var(--color-primary))] font-medium">
                          {item.organization}
                        </p>
                        {item.location && (
                          <p className="text-sm text-[rgb(var(--color-text-muted))]">
                            {item.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--color-bg-subtle))] rounded-full text-sm text-[rgb(var(--color-text-muted))]">
                        <Calendar className="w-4 h-4" />
                        {item.period}
                      </div>
                    </div>

                    <p className="text-[rgb(var(--color-text-muted))] mb-4">
                      {item.description}
                    </p>

                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-xs font-medium bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Resume CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.a
            href="/resume.pdf"
            download
            className="btn-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Award className="w-5 h-5" />
            Download Full Resume
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

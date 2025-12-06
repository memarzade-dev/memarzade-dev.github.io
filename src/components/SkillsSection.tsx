import { Code, Database, Cloud, Smartphone, Brain, Shield, Boxes, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  category: string;
}

const skills: Skill[] = [
  // Frontend
  { name: 'React & Next.js', level: 95, icon: <Code className="w-6 h-6" />, category: 'Frontend' },
  { name: 'TypeScript', level: 90, icon: <Code className="w-6 h-6" />, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 95, icon: <Code className="w-6 h-6" />, category: 'Frontend' },
  { name: 'Vue.js', level: 80, icon: <Code className="w-6 h-6" />, category: 'Frontend' },
  
  // Backend
  { name: 'Laravel', level: 95, icon: <Database className="w-6 h-6" />, category: 'Backend' },
  { name: 'Node.js', level: 90, icon: <Database className="w-6 h-6" />, category: 'Backend' },
  { name: 'Python', level: 88, icon: <Database className="w-6 h-6" />, category: 'Backend' },
  { name: 'PostgreSQL', level: 85, icon: <Database className="w-6 h-6" />, category: 'Backend' },
  
  // AI & ML
  { name: 'LLM Integration', level: 92, icon: <Brain className="w-6 h-6" />, category: 'AI & ML' },
  { name: 'TensorFlow', level: 75, icon: <Brain className="w-6 h-6" />, category: 'AI & ML' },
  { name: 'NLP', level: 80, icon: <Brain className="w-6 h-6" />, category: 'AI & ML' },
  
  // Blockchain
  { name: 'Solidity', level: 85, icon: <Shield className="w-6 h-6" />, category: 'Blockchain' },
  { name: 'Web3.js', level: 88, icon: <Shield className="w-6 h-6" />, category: 'Blockchain' },
  { name: 'Smart Contracts', level: 82, icon: <Shield className="w-6 h-6" />, category: 'Blockchain' },
  
  // Mobile
  { name: 'React Native', level: 85, icon: <Smartphone className="w-6 h-6" />, category: 'Mobile' },
  { name: 'Flutter', level: 70, icon: <Smartphone className="w-6 h-6" />, category: 'Mobile' },
  
  // DevOps
  { name: 'Docker', level: 88, icon: <Boxes className="w-6 h-6" />, category: 'DevOps' },
  { name: 'AWS', level: 82, icon: <Cloud className="w-6 h-6" />, category: 'DevOps' },
  { name: 'CI/CD', level: 85, icon: <Zap className="w-6 h-6" />, category: 'DevOps' },
];

const categories = ['All', 'Frontend', 'Backend', 'AI & ML', 'Blockchain', 'Mobile', 'DevOps'];

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4">Skills & Technologies</h2>
          <p className="text-lg text-[rgb(var(--color-text-muted))]">
            My technical expertise across various domains
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-primary/30'
                  : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-bg-muted))]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="bg-[rgb(var(--color-bg-base))] border border-[rgb(var(--color-border))] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[rgb(var(--color-bg-subtle))] rounded-lg text-[rgb(var(--color-primary))]">
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[rgb(var(--color-text-base))]">
                    {skill.name}
                  </h4>
                  <span className="text-xs text-[rgb(var(--color-text-muted))]">
                    {skill.category}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[rgb(var(--color-text-muted))]">
                    Proficiency
                  </span>
                  <span className="text-sm font-medium text-[rgb(var(--color-primary))]">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 bg-[rgb(var(--color-bg-subtle))] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%)',
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: 'Languages', value: '10+' },
            { label: 'Frameworks', value: '15+' },
            { label: 'Tools', value: '20+' },
            { label: 'Years Coding', value: '5+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-[rgb(var(--color-bg-subtle))] rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-[rgb(var(--color-text-muted))]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
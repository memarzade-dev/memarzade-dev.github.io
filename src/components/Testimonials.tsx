import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'TechStart Inc.',
    content: 'Ali is an exceptional developer who delivered our e-commerce platform ahead of schedule. His expertise in Laravel and React helped us build a scalable solution that handles thousands of daily transactions flawlessly.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Innovation Labs',
    content: 'Working with Ali on our AI-powered chatbot was a game-changer. His deep understanding of LLMs and ability to integrate complex APIs made the impossible possible. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Founder',
    company: 'Blockchain Ventures',
    content: 'Ali\'s blockchain expertise is outstanding. He built our NFT marketplace with clean, secure smart contracts and an intuitive frontend. His attention to detail and commitment to best practices sets him apart.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'CEO',
    company: 'Digital Solutions Co.',
    content: 'From project planning to deployment, Ali demonstrated exceptional skills and professionalism. He not only codes but truly understands business requirements and delivers solutions that drive results.',
    rating: 5,
  },
  {
    name: 'Lisa Anderson',
    role: 'Engineering Director',
    company: 'CloudTech Systems',
    content: 'Ali is a rare find - equally strong in backend and frontend development. His work on our analytics dashboard exceeded expectations, and his code quality is consistently excellent.',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4">Client Testimonials</h2>
          <p className="text-lg text-[rgb(var(--color-text-muted))]">
            What people say about working with me
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Carousel */}
            <div className="relative h-[400px] md:h-[350px] overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute w-full"
                >
                  <div className="bg-[rgb(var(--color-bg-base))] border border-[rgb(var(--color-border))] rounded-2xl p-8 md:p-12 shadow-xl">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-[rgb(var(--color-primary))] bg-opacity-10 rounded-full">
                        <Quote className="w-8 h-8 text-[rgb(var(--color-primary))]" />
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-lg text-center text-[rgb(var(--color-text-base))] mb-8 italic leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </p>

                    {/* Author */}
                    <div className="text-center">
                      <h4 className="font-semibold text-[rgb(var(--color-text-base))]">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-[rgb(var(--color-text-muted))]">
                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                onClick={() => paginate(-1)}
                className="p-3 bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-[rgb(var(--color-primary))] w-8'
                        : 'bg-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-text-muted))]'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                onClick={() => paginate(1)}
                className="p-3 bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { label: 'Happy Clients', value: '50+' },
              { label: 'Average Rating', value: '5.0' },
              { label: 'Projects Delivered', value: '100%' },
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
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { Clock, Tag, ChevronRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl"
          >
            Book your next <br />
            <span className="text-neutral-400">experience today.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400"
          >
            The all-in-one platform to find and book professional services. 
            From wellness to fitness, we've got you covered.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex items-center justify-center space-x-4"
          >
            <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse Services
            </Button>
            <Button variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-neutral-900">
              How it works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-2 text-neutral-600">Choose from our curated list of professional services.</p>
          </div>
          <div className="flex space-x-2">
            {['All', 'Salon', 'Spa', 'Health', 'Fitness'].map(cat => (
              <Badge key={cat} variant="neutral">{cat}</Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer" >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="neutral" className="bg-white/90 backdrop-blur-sm">{service.category}</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg group-hover:text-neutral-600 transition-colors">{service.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-neutral-900">4.9</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Clock className="mr-1 h-4 w-4" />
                        {service.duration} min
                      </div>
                      <div className="text-lg font-bold">KSH {service.price}</div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline" 
                      icon={ChevronRight}
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold">10k+</div>
              <div className="mt-2 text-neutral-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="mt-2 text-neutral-600">Professional Experts</div>
            </div>
            <div>
              <div className="text-4xl font-bold">4.9/5</div>
              <div className="mt-2 text-neutral-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

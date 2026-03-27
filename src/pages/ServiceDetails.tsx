import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { Button, Card, Badge, Input } from '../components/UI';
import { Clock, DollarSign, Calendar as CalendarIcon, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setIsLoading(false);
      });
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    if (!formData.phone) {
      toast.error('Please provide a phone number');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: id,
          userId: user.id,
          date: selectedDate,
          time: selectedTime,
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
        }),
      });

      if (response.ok) {
        setStep(3);
        toast.success('Booking request sent successfully!');
      } else {
        toast.error('Failed to book service');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center">Loading...</div>;
  if (!service) return <div>Service not found</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Button variant="ghost" icon={ChevronLeft} onClick={() => navigate(-1)} className="mb-8">
        Back to Services
      </Button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <img 
              src={service.image} 
              alt={service.name} 
              className="w-full aspect-video object-cover rounded-2xl shadow-lg"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight">{service.name}</h1>
              <Badge variant="neutral">{service.category}</Badge>
            </div>
            <div className="flex space-x-6 text-neutral-600">
              <div className="flex items-center"><Clock className="mr-2 h-5 w-5" /> {service.duration} mins</div>
              <div className="flex items-center"><span className="mr-1 text-sm font-bold">KSH</span> {service.price}</div>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">What to expect</h2>
            <ul className="space-y-4">
              {[
                'Professional and certified experts',
                'High-quality equipment and products',
                'Personalized attention to your needs',
                'Clean and comfortable environment'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-neutral-600">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6 space-y-6">
            {step === 1 && (
              <>
                <h3 className="text-xl font-bold">Book this service</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2, 3, 4, 5].map(offset => {
                        const date = addDays(new Date(), offset);
                        const isSelected = selectedDate === format(date, 'yyyy-MM-dd');
                        return (
                          <button
                            key={offset}
                            onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                            className={cn(
                              'p-2 rounded-lg border text-center transition-all',
                              isSelected ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-neutral-400'
                            )}
                          >
                            <div className="text-xs uppercase opacity-60">{format(date, 'EEE')}</div>
                            <div className="font-bold">{format(date, 'dd')}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Available Slots</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'p-2 rounded-lg border text-sm transition-all',
                            selectedTime === time ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-neutral-400'
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setStep(2)} disabled={!selectedTime}>
                    Continue to Details
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-xl font-bold">Your Details</h3>
                <div className="space-y-4">
                  <Input 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" onClick={handleBooking}>
                      Confirm Booking
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                      Back
                    </Button>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
                <p className="text-neutral-600">
                  Your booking for <strong>{service.name}</strong> on {format(new Date(selectedDate), 'MMMM dd')} at {selectedTime} has been received.
                </p>
                <Button className="w-full" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Booking, Service } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Record<string, Service>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          fetch(`/api/bookings/user/${user.id}`),
          fetch('/api/services')
        ]);
        
        const bookingsData = await bookingsRes.json();
        const servicesData = await servicesRes.json();
        
        const servicesMap = servicesData.reduce((acc: any, s: Service) => {
          acc[s.id] = s;
          return acc;
        }, {});

        setBookings(bookingsData);
        setServices(servicesMap);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) return <div className="p-8">Loading...</div>;

  const upcoming = bookings.filter(b => b.status !== 'cancelled' && new Date(b.date) >= new Date());
  const past = bookings.filter(b => b.status === 'cancelled' || new Date(b.date) < new Date());

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 space-y-12">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-neutral-600">Manage your bookings and explore new services.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
            {upcoming.length === 0 ? (
              <Card className="p-8 text-center text-neutral-500">
                No upcoming bookings. <Link to="/" className="text-black underline">Browse services</Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcoming.map(booking => {
                  const service = services[booking.serviceId];
                  return (
                    <Card key={booking.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={service?.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold">{service?.name}</h3>
                          <div className="flex items-center text-sm text-neutral-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" size="sm" icon={ChevronRight} />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
            <div className="space-y-4 opacity-70">
              {past.map(booking => {
                const service = services[booking.serviceId];
                return (
                  <Card key={booking.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-neutral-100">
                        <img src={service?.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{service?.name}</h3>
                        <div className="text-xs text-neutral-500">
                          {format(new Date(booking.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="neutral">{booking.status}</Badge>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-black text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-neutral-400 mb-4">Our support team is available 24/7 to help you with your bookings.</p>
            <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-900">Contact Support</Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Email Notifications</span>
                <div className="h-5 w-10 rounded-full bg-green-500 relative">
                  <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">SMS Alerts</span>
                <div className="h-5 w-10 rounded-full bg-neutral-200 relative">
                  <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';

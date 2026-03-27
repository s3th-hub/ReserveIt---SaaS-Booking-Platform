import React, { useEffect, useState } from 'react';
import { Analytics, Booking, Service } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { Users, Calendar, DollarSign, TrendingUp, Check, X, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/analytics').then(res => res.json()).then(setAnalytics);
    fetch('/api/bookings').then(res => res.json()).then(data => setRecentBookings(data.slice(-5).reverse()));
  }, []);

  if (!analytics) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Bookings', value: analytics.totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Users', value: analytics.activeUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Revenue', value: `KSH ${analytics.revenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="font-medium">{booking.userName}</p>
                  <p className="text-xs text-neutral-500">{booking.time} • {format(new Date(booking.date), 'MMM dd')}</p>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-sm" onClick={() => navigate('/admin/bookings')}>View all bookings</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex-col space-y-2" onClick={() => navigate('/admin/services')}>
              <Menu className="h-6 w-6" />
              <span>Manage Services</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2" onClick={() => navigate('/admin/bookings')}>
              <Calendar className="h-6 w-6" />
              <span>View Calendar</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = () => {
    fetch('/api/bookings').then(res => res.json()).then(data => {
      setBookings(data.reverse());
      setIsLoading(false);
    });
  };

  useEffect(fetchBookings, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Booking ${status}`);
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Service ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Date & Time</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-900">{booking.userName}</div>
                  <div className="text-xs text-neutral-500">{booking.userEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">#{booking.serviceId}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {format(new Date(booking.date), 'MMM dd, yyyy')}<br/>
                  <span className="text-xs opacity-60">{booking.time}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}>
                    {booking.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" icon={Check} onClick={() => handleStatus(booking.id, 'confirmed')} />
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" icon={X} onClick={() => handleStatus(booking.id, 'cancelled')} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const fetchServices = () => {
    fetch('/api/services').then(res => res.json()).then(setServices);
  };

  useEffect(fetchServices, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchServices();
    toast.success('Service deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <Button onClick={() => { setEditingService({}); setIsModalOpen(true); }}>Add Service</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4 flex items-center space-x-4">
            <img src={service.image} className="h-16 w-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <h3 className="font-bold">{service.name}</h3>
              <p className="text-sm text-neutral-500">KSH {service.price} • {service.duration}m</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)} className="text-red-600">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


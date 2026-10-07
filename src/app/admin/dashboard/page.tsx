'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
  name?: string;
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState({
    bookings: 0,
    contacts: 0,
    services: 0,
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      router.push('/admin');
      return;
    }

    setUser(JSON.parse(userData) as AdminUser);
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const [bookingsRes, contactsRes, servicesRes] = await Promise.all([
        fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/contacts', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/services'),
      ]);

      const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
      const contacts = contactsRes.ok ? await contactsRes.json() : [];
      const services = servicesRes.ok ? await servicesRes.json() : [];

      setStats({
        bookings: bookings.length,
        contacts: contacts.length,
        services: services.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-gold">JG Impact Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Bookings</h3>
            <p className="text-4xl font-bold text-brand-gold">{stats.bookings}</p>
            <Link href="/admin/bookings" className="text-blue-500 text-sm mt-2 hover:underline">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Contact Messages</h3>
            <p className="text-4xl font-bold text-brand-gold">{stats.contacts}</p>
            <Link href="/admin/contacts" className="text-blue-500 text-sm mt-2 hover:underline">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Services</h3>
            <p className="text-4xl font-bold text-brand-gold">{stats.services}</p>
            <Link href="/admin/services" className="text-blue-500 text-sm mt-2 hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/bookings"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-center"
            >
              Manage Bookings
            </Link>
            <Link
              href="/admin/contacts"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-center"
            >
              View Messages
            </Link>
            <Link
              href="/admin/services"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-center"
            >
              Manage Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

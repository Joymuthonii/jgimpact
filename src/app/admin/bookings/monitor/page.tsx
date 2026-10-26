'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type BookingFilter = 'all' | BookingStatus;

interface Booking {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  status: BookingStatus;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'border-yellow-300 bg-yellow-100 text-yellow-900',
  confirmed: 'border-blue-300 bg-blue-100 text-blue-900',
  completed: 'border-green-300 bg-green-100 text-green-900',
  cancelled: 'border-red-300 bg-red-100 text-red-900',
};

const FILTERS: { value: BookingFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All Bookings', color: 'border-gray-300 bg-gray-100 text-gray-900' },
  { value: 'pending', label: 'Pending', color: STATUS_STYLES.pending },
  { value: 'confirmed', label: 'Confirmed', color: STATUS_STYLES.confirmed },
  { value: 'completed', label: 'Completed', color: STATUS_STYLES.completed },
  { value: 'cancelled', label: 'Cancelled', color: STATUS_STYLES.cancelled },
];

function getStatusLabel(status: BookingStatus) {
  return status === 'cancelled' ? 'Cancelled' : status[0].toUpperCase() + status.slice(1);
}

export default function BookingMonitorPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    setToken(adminToken);
    void loadBookings(adminToken);
  }, [router]);

  const loadBookings = async (adminToken: string) => {
    setErrorMessage('');
    try {
      const response = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!response.ok) throw new Error('Could not load bookings.');
      setBookings(await response.json());
    } catch (error) {
      console.error('Error loading booking monitor:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Could not update booking status.');
      const updatedBooking: Booking = await response.json();
      setBookings((current) =>
        current.map((booking) => (booking._id === bookingId ? updatedBooking : booking))
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Could not update booking status.');
    }
  };

  const visibleBookings = useMemo(
    () => bookings.filter((booking) => filter === 'all' || booking.status === filter),
    [bookings, filter]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold text-brand-gold">Booking Monitor</h1>
          <div className="flex gap-4">
            <Link href="/admin/bookings" className="text-blue-600 hover:underline">
              Manage Bookings
            </Link>
            <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="mb-6 text-gray-600">
          Filter bookings by status and update a booking as its progress changes.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {FILTERS.map((item) => {
            const count =
              item.value === 'all'
                ? bookings.length
                : bookings.filter((booking) => booking.status === item.value).length;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                aria-pressed={filter === item.value}
                className={`rounded-lg border p-4 text-left transition-shadow hover:shadow ${
                  item.color
                } ${filter === item.value ? 'ring-2 ring-brand-navy ring-offset-2' : ''}`}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="mt-1 block text-2xl font-bold">{count}</span>
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <div role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center">Loading bookings...</div>
        ) : visibleBookings.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
            {filter === 'all' ? 'No bookings yet.' : `No ${filter} bookings.`}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full min-w-[800px]">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-bold">Client</th>
                  <th className="px-5 py-3 text-left text-sm font-bold">Contact</th>
                  <th className="px-5 py-3 text-left text-sm font-bold">Service</th>
                  <th className="px-5 py-3 text-left text-sm font-bold">Session Date</th>
                  <th className="px-5 py-3 text-left text-sm font-bold">Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium">{booking.fullName}</td>
                    <td className="px-5 py-4 text-sm">
                      <div>{booking.phone}</div>
                      {booking.email && <div className="text-gray-500">{booking.email}</div>}
                    </td>
                    <td className="px-5 py-4 text-sm">{booking.serviceType}</td>
                    <td className="px-5 py-4 text-sm">
                      {new Date(booking.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <label className="sr-only" htmlFor={`booking-status-${booking._id}`}>
                        Status for {booking.fullName}
                      </label>
                      <select
                        id={`booking-status-${booking._id}`}
                        value={booking.status}
                        onChange={(event) =>
                          updateStatus(booking._id, event.target.value as BookingStatus)
                        }
                        className={`rounded-full border px-3 py-1.5 font-semibold ${STATUS_STYLES[booking.status]}`}
                      >
                        <option value="pending">{getStatusLabel('pending')}</option>
                        <option value="confirmed">{getStatusLabel('confirmed')}</option>
                        <option value="completed">{getStatusLabel('completed')}</option>
                        <option value="cancelled">{getStatusLabel('cancelled')}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

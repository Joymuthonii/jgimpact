'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  notes?: string;
  status: BookingStatus;
}

interface ImportRowError {
  row: number;
  errors: string[];
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'border-yellow-300 bg-yellow-100 text-yellow-900',
  confirmed: 'border-blue-300 bg-blue-100 text-blue-900',
  completed: 'border-green-300 bg-green-100 text-green-900',
  cancelled: 'border-red-300 bg-red-100 text-red-900',
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [importErrors, setImportErrors] = useState<ImportRowError[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    setToken(adminToken);
    void fetchBookings(adminToken);
  }, [router]);

  const fetchBookings = async (adminToken: string) => {
    setErrorMessage('');
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update booking status.');
      await fetchBookings(token);
    } catch (error) {
      console.error('Error updating booking:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update booking.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete booking.');
      await fetchBookings(token);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete booking.');
    }
  };

  const downloadFile = async (path: string, filename: string) => {
    const response = await fetch(path, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.message || 'Could not download the Excel file.');
    }

    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const downloadTemplate = async () => {
    try {
      await downloadFile('/api/bookings/template', 'jg-impact-booking-template.xlsx');
    } catch (error) {
      console.error('Error creating booking template:', error);
      setErrorMessage('Could not create the Excel template. Please try again.');
    }
  };

  const exportBookings = async () => {
    try {
      await downloadFile('/api/bookings?format=xlsx', 'jg-impact-bookings.xlsx');
    } catch (error) {
      console.error('Error exporting bookings:', error);
      setErrorMessage('Could not export bookings. Please try again.');
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setErrorMessage('');
    setImportErrors([]);
    setSuccessMessage('');
    setIsImporting(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension !== 'xlsx') {
        throw new Error('Choose an Excel workbook in .xlsx format.');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Excel workbooks must be 10 MB or smaller.');
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/bookings/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        setImportErrors(result.invalidRows ?? []);
        throw new Error(result.message || 'Failed to import bookings.');
      }

      setSuccessMessage(result.message);
      await fetchBookings(token);
    } catch (error) {
      console.error('Error importing bookings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to import bookings.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-brand-gold">Bookings Management</h1>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin/bookings/monitor" className="text-blue-600 hover:underline">
              Booking Monitor
            </Link>
            <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Excel booking tools</h2>
          <p className="mt-2 text-sm text-gray-600">
            Use the template to import bookings entered outside the website. One row creates one
            booking, so a client can have multiple sessions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void downloadTemplate()}
              className="rounded bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-800"
            >
              Download Excel Template
            </button>
            <label className="cursor-pointer rounded bg-brand-green px-4 py-2 font-medium text-white hover:opacity-90">
              {isImporting ? 'Importing...' : 'Import Excel'}
              <input
                type="file"
                accept=".xlsx"
                onChange={handleImport}
                disabled={isImporting}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={() => void exportBookings()}
              disabled={bookings.length === 0}
              className="rounded bg-brand-gold px-4 py-2 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export Bookings to Excel
            </button>
          </div>
        </section>

        {errorMessage && (
          <div role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {errorMessage}
            {importErrors.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-sm">
                {importErrors.map((rowError) => (
                  <li key={rowError.row}>
                    Row {rowError.row}: {rowError.errors.join(' ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-6 rounded border border-green-200 bg-green-50 p-4 text-green-800">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
            No bookings yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full min-w-[900px]">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{booking.fullName}</td>
                    <td className="px-6 py-4 text-sm">{booking.email || '-'}</td>
                    <td className="px-6 py-4 text-sm">{booking.phone}</td>
                    <td className="px-6 py-4 text-sm">{booking.serviceType}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Intl.DateTimeFormat('en-KE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Africa/Nairobi',
                      }).format(new Date(booking.preferredDate))}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        aria-label={`Status for ${booking.fullName}`}
                        value={booking.status}
                        onChange={(event) =>
                          handleStatusChange(booking._id, event.target.value as BookingStatus)
                        }
                        className={`rounded border px-2 py-1 font-medium ${STATUS_STYLES[booking.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

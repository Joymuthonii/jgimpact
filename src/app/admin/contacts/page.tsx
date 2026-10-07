'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    setToken(adminToken);
    fetchContacts(adminToken);
  }, [router]);

  const fetchContacts = async (adminToken) => {
    try {
      const res = await fetch('/api/contacts', {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });

      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id) => {
    if (!response.trim()) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        setResponse('');
        setSelectedContact(null);
        fetchContacts(token);
      }
    } catch (error) {
      console.error('Error responding to contact:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchContacts(token);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-gold">Contact Messages</h1>
          <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No contact messages yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2 space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{contact.fullName}</h4>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        contact.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : contact.status === 'read'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <h5 className="font-semibold mb-1">{contact.subject}</h5>
                  <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                  <h3 className="font-bold text-lg mb-4">Message Details</h3>

                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">From:</label>
                      <p>{selectedContact.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Email:</label>
                      <p>{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Phone:</label>
                      <p>{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Subject:</label>
                      <p>{selectedContact.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Message:</label>
                      <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {selectedContact.response && (
                    <div className="mb-6 p-4 bg-green-50 rounded border border-green-200">
                      <p className="text-sm font-semibold text-green-800 mb-2">Response:</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedContact.response}</p>
                    </div>
                  )}

                  {!selectedContact.response && (
                    <div className="space-y-3">
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full px-3 py-2 border rounded text-sm"
                        rows="4"
                      />
                      <button
                        onClick={() => handleRespond(selectedContact._id)}
                        className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
                      >
                        Send Response
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="w-full mt-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm"
                  >
                    Delete Message
                  </button>

                  <button
                    onClick={() => setSelectedContact(null)}
                    className="w-full mt-2 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

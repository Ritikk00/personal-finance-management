import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Alert, LoadingSpinner } from '../components/Common';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    currency: 'USD',
    categories: [],
    notificationPreferences: {
      emailNotifications: true,
      budgetAlerts: true,
      goalReminders: true,
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setProfile(data);
      setFormData({
        fullName: data.fullName,
        currency: data.currency,
        categories: data.categories,
        notificationPreferences: data.notificationPreferences,
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSuccess('Profile updated successfully');
      setProfile(data.user);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'INR', label: 'INR (₹)' },
            ]}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.emailNotifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        emailNotifications: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.budgetAlerts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        budgetAlerts: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                <span>Budget Alerts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences.goalReminders}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        goalReminders: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                <span>Goal Reminders</span>
              </label>
            </div>
          </div>

          <div className="space-x-4">
            <Button type="submit" variant="primary">Save Changes</Button>
            <Button type="button" onClick={logout} variant="danger">Logout</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

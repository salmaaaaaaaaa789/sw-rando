# Admin Authentication System for Randopedia Travel

## Overview
This document explains how to implement the admin authentication system with role-based access control for your Randopedia Travel application using Supabase.

## Backend Setup (Supabase Database)

The `admin-auth-schema.sql` file contains:

1. **User Profiles Table** - Extends Supabase Auth with role-based access
2. **Triggers** - Automatically syncs Supabase Auth users with profiles
3. **RLS Policies** - Enforces role-based access control
4. **Helper Functions** - For admin verification and role management

## Frontend Implementation

### 1. Admin Authentication Hook

Create a custom hook to manage admin authentication:

```javascript
// hooks/useAdminAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAdminStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          checkAdminStatus();
        } else if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check admin status using the custom function
    const { data, error } = await supabase
      .rpc('check_admin_access');

    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } else if (data && data.length > 0) {
      const adminData = data[0];
      setIsAdmin(adminData.is_admin);
      setUser({
        id: adminData.user_id,
        email: adminData.email,
        full_name: adminData.full_name
      });
    } else {
      setIsAdmin(false);
    }
    
    setLoading(false);
  };

  return { isAdmin, loading, user, checkAdminStatus };
};
```

### 2. Protected Admin Route Component

Create a component to protect admin-only routes:

```jsx
// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### 3. Admin Login Component

Create an admin login component:

```jsx
// components/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if user is admin after login
    const { data: adminData, error: adminError } = await supabase
      .rpc('check_admin_access');

    if (adminError || !adminData || !adminData[0]?.is_admin) {
      await supabase.auth.signOut();
      setError('Admin access required');
      setLoading(false);
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign in as Admin'}
        </Button>
      </form>
    </div>
  );
};
```

### 4. Admin Dashboard Component

Create an admin dashboard with role verification:

```jsx
// components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';

export const AdminDashboard = () => {
  const { isAdmin, loading, user, checkAdminStatus } = useAdminAuth();
  const [voyages, setVoyages] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    // Fetch voyages
    const { data: voyageData, error: voyageError } = await supabase
      .from('voyages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!voyageError) {
      setVoyages(voyageData);
    }

    // Fetch recent bookings
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        voyages!inner (title)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!bookingError) {
      setBookings(bookingData);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Access denied. Admin required.</div>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      
      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="text-xl font-semibold">Welcome, {user?.full_name || user?.email}</h2>
        <p>Admin access verified.</p>
      </div>
      
      {/* Dashboard content for managing voyages */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Voyages</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voyages.map((voyage) => (
                <tr key={voyage.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{voyage.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${voyage.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      voyage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {voyage.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(voyage.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Dashboard content for managing bookings */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voyage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.voyages?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.participants}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.travel_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

### 5. Route Setup

Set up your routes in your main App component:

```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminRoute } from './components/AdminRoute';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { VoyagesManager } from './components/VoyagesManager'; // Your voyage management component
import { BookingsManager } from './components/BookingsManager'; // Your booking management component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="/admin/voyages" element={
          <AdminRoute>
            <VoyagesManager />
          </AdminRoute>
        } />
        
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <BookingsManager />
          </AdminRoute>
        } />
        
        {/* Other public routes for clients */}
        <Route path="/" element={<HomePage />} />
        <Route path="/voyages" element={<VoyagesPage />} />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
}

export default App;
```

## Supabase Database Setup

1. Execute the `admin-auth-schema.sql` file in your Supabase SQL editor
2. This will set up the user profile table, triggers, RLS policies, and helper functions

## Creating an Initial Admin Account

To create your first admin account:

1. Create a user account through Supabase Auth (either programmatically or via the Supabase dashboard)
2. Run this SQL command in the Supabase SQL editor, replacing the email with your admin email:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

Or use the helper function:

```sql
SELECT create_admin_user('your-admin-email@example.com', 'Admin User');
```

## Security Notes

- The system enforces security through Supabase RLS policies
- Admin access is verified through the `is_admin()` function
- All sensitive operations are protected by role checks
- The system automatically maintains security even if someone accesses the database directly

This admin authentication system provides a robust, secure foundation for the admin functionality of your travel application while fully integrating with Supabase Auth.
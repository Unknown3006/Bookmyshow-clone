import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, updatePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
    const { user, loading: authLoading, logout, reloadUser } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            setIsUpdating(true);
            await updateUserProfile(profileData);
            await reloadUser(); // Reload user data after update
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate password input
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password should be at least 6 characters long.');
            return;
        }

        try {
            setIsChangingPassword(true);
            await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Error updating password:', err);
            setError(err.response?.data?.message || 'Failed to update password. Please try again.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (authLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Profile</h1>

            <div className={styles.profileContent}>
                {/* Profile Update Section */}
                <div className={styles.card}>
                    <h2>Profile Information</h2>

                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    <form onSubmit={handleUpdateProfile} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitBtn}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Password Change Section */}
                <div className={styles.card}>
                    <h2>Change Password</h2>

                    <form onSubmit={handleUpdatePassword} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitBtn}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>

                {/* Account Actions */}
                <div className={styles.actions}>
                    <button onClick={() => navigate('/my-bookings')} className={styles.bookingsBtn}>
                        View My Bookings
                    </button>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile; 
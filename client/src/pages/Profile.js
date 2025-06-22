import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../api/auth';

const Profile = ({ user }) => {
  const [form, setForm] = useState({
    name: '',
    bio: '',
    designation: '',
    profile_pic_url: '',
    social: { linkedin: '', twitter: '', github: '' }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        setForm({
          name: profile.name || '',
          bio: profile.bio || '',
          designation: profile.designation || '',
          profile_pic_url: profile.profile_pic_url || '',
          social: {
            linkedin: profile.social?.linkedin || '',
            twitter: profile.social?.twitter || '',
            github: profile.social?.github || ''
          }
        });
        setLoading(false);
      } catch {
        alert('Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (['linkedin', 'twitter', 'github'].includes(name)) {
      setForm(prev => ({ ...prev, social: { ...prev.social, [name]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateProfile(form);
      alert('Profile updated');
    } catch {
      alert('Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />

        <input name="linkedin" value={form.social.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
        <input name="twitter" value={form.social.twitter} onChange={handleChange} placeholder="Twitter URL" />
        <input name="github" value={form.social.github} onChange={handleChange} placeholder="GitHub URL" />

        <input name="profile_pic_url" value={form.profile_pic_url} onChange={handleChange} placeholder="Profile Image URL" />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;

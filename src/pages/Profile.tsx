import React, { useState } from 'react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';
import { ScrollReveal } from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { useStreak } from '../context/StreakContext';
import { Edit, Lock, Save, X, Award, BookOpen, Users, Clock, TrendingUp, Mail, Github, Linkedin, Twitter, Trophy, Star, Flame } from 'lucide-react';

export function Profile() {
    const { user } = useAuth();
    const { streak } = useStreak();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        educationLevel: user?.educationLevel || '',
        major: user?.major || '',
        bio: 'Passionate learner focused on Computer Science and Mathematics',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSave = () => {
        alert('Profile updated successfully!');
        setIsEditing(false);
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        alert('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const achievements = [
        { id: 1, title: '7-Day Streak', description: 'Studied for 7 consecutive days', icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-400/30' },
        { id: 2, title: 'Top Contributor', description: 'Uploaded 10+ resources', icon: BookOpen, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-400/30' },
        { id: 3, title: 'Study Partner', description: 'Connected with 5+ partners', icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-400/30' },
        { id: 4, title: 'Time Master', description: 'Completed 50+ study sessions', icon: Clock, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/30' },
    ];

    const stats = [
        { label: 'Study Hours', value: '127', icon: Clock, color: 'text-cyan-400', bgColor: 'from-cyan-500/10 to-blue-500/10', borderColor: 'border-cyan-300/30' },
        { label: 'Resources Shared', value: '23', icon: BookOpen, color: 'text-purple-400', bgColor: 'from-purple-500/10 to-violet-500/10', borderColor: 'border-purple-300/30' },
        { label: 'Study Partners', value: '12', icon: Users, color: 'text-green-400', bgColor: 'from-green-500/10 to-emerald-500/10', borderColor: 'border-green-300/30' },
        { label: 'Current Streak', value: streak.toString(), icon: Flame, color: 'text-orange-400', bgColor: 'from-orange-500/10 to-red-500/10', borderColor: 'border-orange-300/30' },
    ];

    return (
        <AnimatedWrapper className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 rounded-2xl p-8 border border-blue-400/30 shadow-lg shadow-blue-500/20 animate-slide-down">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent animate-pulse" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Profile</h1>
                        <p className="text-blue-100 text-lg">Manage your account settings</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="group inline-flex items-center justify-center rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all h-12 px-8 py-2"
                        >
                            <Edit className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <ScrollReveal delay={0.1} width="100%">
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`group bg-gradient-to-br ${stat.bgColor} backdrop-blur border-2 ${stat.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <div className="md:col-span-2">
                    <ScrollReveal delay={0.2} width="100%">
                        <div className="group rounded-2xl border-2 border-blue-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                            <div className="relative p-8 space-y-6">
                                {/* Avatar and Basic Info */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student'}
                                            alt={user?.name}
                                            className="h-32 w-32 rounded-full bg-slate-800 border-4 border-cyan-400/30 group-hover:border-cyan-400/60 transition-all group-hover:scale-110 shadow-lg"
                                        />
                                        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-slate-900 bg-green-500 animate-pulse" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h2 className="text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">{user?.name}</h2>
                                        <p className="text-blue-300">{user?.email}</p>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                                {user?.educationLevel || 'Undergraduate'}
                                            </span>
                                            <span className="inline-flex items-center rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                                                {user?.major || 'Computer Science'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="text-sm font-medium text-white mb-2 block">Bio</label>
                                    {isEditing ? (
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-400">{formData.bio}</p>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-white">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-400">{user?.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-white">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-white">Education Level</label>
                                        {isEditing ? (
                                            <select
                                                className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                value={formData.educationLevel}
                                                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                                            >
                                                <option>Undergraduate</option>
                                                <option>Graduate</option>
                                                <option>PhD</option>
                                            </select>
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-400">{user?.educationLevel || 'Undergraduate'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-white">Major</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                value={formData.major}
                                                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-400">{user?.major || 'Computer Science'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-11 px-6 transition-all hover:scale-105 shadow-lg"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Social Links & Security */}
                <div className="space-y-6">
                    {/* Social Links */}
                    <ScrollReveal delay={0.3} width="100%">
                        <div className="group rounded-2xl border-2 border-purple-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300">
                            <div className="p-6 space-y-4">
                                <h3 className="text-lg font-bold text-white">Social Links</h3>
                                <div className="space-y-3">
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 hover:scale-105 transition-all">
                                        <Linkedin className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm text-white">LinkedIn</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-slate-500/10 border border-slate-400/30 hover:bg-slate-500/20 hover:scale-105 transition-all">
                                        <Github className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-white">GitHub</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-sky-500/10 border border-sky-400/30 hover:bg-sky-500/20 hover:scale-105 transition-all">
                                        <Twitter className="w-5 h-5 text-sky-400" />
                                        <span className="text-sm text-white">Twitter</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Security */}
                    <ScrollReveal delay={0.4} width="100%">
                        <div className="group rounded-2xl border-2 border-red-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-red-500/30 hover:scale-[1.02] transition-all duration-300">
                            <div className="p-6 space-y-4">
                                <h3 className="text-lg font-bold text-white">Security</h3>
                                <button
                                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 hover:scale-105 transition-all"
                                >
                                    <Lock className="w-5 h-5 text-red-400" />
                                    <span className="text-sm text-white">Change Password</span>
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Achievements */}
            <ScrollReveal delay={0.5} width="100%">
                <div className="group rounded-2xl border-2 border-yellow-300/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="w-8 h-8 text-yellow-400" />
                            <h3 className="text-2xl font-bold text-white">Achievements</h3>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                            {achievements.map((achievement, index) => (
                                <div
                                    key={achievement.id}
                                    className={`group/item p-6 rounded-xl border-2 ${achievement.borderColor} ${achievement.bgColor} hover:scale-105 transition-all duration-300`}
                                >
                                    <achievement.icon className={`w-12 h-12 ${achievement.color} mb-4 group-hover/item:scale-110 transition-transform`} />
                                    <h4 className="font-bold text-white mb-1">{achievement.title}</h4>
                                    <p className="text-xs text-slate-400">{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Password Change Dialog */}
            {isChangingPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border-2 border-cyan-400/30 bg-slate-900 shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between border-b border-cyan-400/20 p-6">
                            <h2 className="text-xl font-bold text-white">Change Password</h2>
                            <button
                                onClick={() => setIsChangingPassword(false)}
                                className="rounded-lg p-2 hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-white">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 w-full h-11 rounded-xl border-2 border-cyan-300/30 bg-slate-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all hover:scale-105"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AnimatedWrapper>
    );
}

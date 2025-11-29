import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, X, Coins, Award, Clock, Circle, Settings, CheckCircle, Volume2, CloudRain, Trees, Coffee, Music } from 'lucide-react';
import { AnimatedWrapper } from '../components/AnimatedWrapper';

export function PomodoroPage() {
    const navigate = useNavigate();
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('userCoins') || '0'));
    const [sessions, setSessions] = useState(0);

    // New Features State
    const [task, setTask] = useState('');
    const [isTaskSet, setIsTaskSet] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [timerSettings, setTimerSettings] = useState({
        work: 25,
        shortBreak: 5,
        longBreak: 15
    });
    const [activeSound, setActiveSound] = useState<string | null>(null);

    // Music Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    const tracks = [
        { title: "Chill Lo-Fi Study", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Midnight Jazz", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Rainy Window", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { title: "Coffee Shop Vibes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
        { title: "Late Night Code", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
        { title: "Sunday Morning", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
        { title: "Focus Flow", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
        { title: "Deep Concentration", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { title: "Urban Sunset", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
        { title: "Dreamy Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
    ];

    useEffect(() => {
        if (audioElement) {
            audioElement.volume = volume;
        }
    }, [volume, audioElement]);

    useEffect(() => {
        if (isPlaying && !audioElement) {
            const audio = new Audio(tracks[currentTrackIndex].url);
            audio.loop = true;
            audio.volume = volume;
            audio.play();
            setAudioElement(audio);
        } else if (isPlaying && audioElement) {
            if (audioElement.src !== tracks[currentTrackIndex].url) {
                audioElement.pause();
                audioElement.src = tracks[currentTrackIndex].url;
                audioElement.play();
            } else {
                audioElement.play();
            }
        } else if (!isPlaying && audioElement) {
            audioElement.pause();
        }

        return () => {
            // Cleanup on unmount
            if (audioElement) {
                audioElement.pause();
            }
        };
    }, [isPlaying, currentTrackIndex]);

    const toggleMusic = () => {
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    };

    useEffect(() => {
        let interval: any = null;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false);
                        if (!isBreak) {
                            const newCoins = coins + 250;
                            setCoins(newCoins);
                            localStorage.setItem('userCoins', newCoins.toString());
                            setSessions(sessions + 1);
                            setIsBreak(true);
                            setMinutes(timerSettings.shortBreak);
                            setSeconds(0);
                        } else {
                            setIsBreak(false);
                            setMinutes(timerSettings.work);
                            setSeconds(0);
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                        if (!isBreak && seconds === 0) {
                            const newCoins = coins + 10;
                            setCoins(newCoins);
                            localStorage.setItem('userCoins', newCoins.toString());
                        }
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, isBreak, coins, sessions, timerSettings]);

    const toggleTimer = () => {
        if (!isTaskSet && !isBreak && !task) {
            alert('Please set a focus task first!');
            return;
        }
        setIsActive(!isActive);
        if (!isTaskSet && task) setIsTaskSet(true);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(isBreak ? timerSettings.shortBreak : timerSettings.work);
        setSeconds(0);
    };

    const handleSettingChange = (setting: keyof typeof timerSettings, value: number) => {
        setTimerSettings(prev => ({ ...prev, [setting]: value }));
        if (!isActive) {
            if (setting === 'work' && !isBreak) setMinutes(value);
            if (setting === 'shortBreak' && isBreak) setMinutes(value);
        }
    };

    const totalSeconds = minutes * 60 + seconds;
    const maxSeconds = isBreak ? timerSettings.shortBreak * 60 : timerSettings.work * 60;
    const progress = ((maxSeconds - totalSeconds) / maxSeconds) * 100;

    const ambientSounds = [
        { id: 'rain', name: 'Rain', icon: CloudRain },
        { id: 'forest', name: 'Forest', icon: Trees },
        { id: 'cafe', name: 'Cafe', icon: Coffee },
    ];

    return (
        <AnimatedWrapper className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 animate-fade-in overflow-y-auto">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse-slow pointer-events-none" />

            {/* Top Controls */}
            <div className="absolute top-6 right-6 z-50 flex gap-4">
                <button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    className={`p-2 transition-all hover:scale-110 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-slate-400 hover:text-white'}`}
                >
                    <Music className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-slate-400 hover:text-white transition-all hover:rotate-90"
                >
                    <Settings className="w-6 h-6" />
                </button>
                <button
                    onClick={() => navigate('/app/dashboard')}
                    className="p-2 text-slate-400 hover:text-white transition-all hover:scale-110"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="relative z-10 min-h-full flex flex-col items-center justify-center p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-slide-down">
                    <h1 className="text-5xl font-light text-white mb-3 tracking-wide drop-shadow-lg">
                        Focus Session
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Circle className={`w-2 h-2 transition-colors duration-500 ${isActive ? 'fill-purple-500 text-purple-500 animate-ping' : 'fill-slate-600 text-slate-600'}`} />
                        <p className="text-slate-400 text-sm uppercase tracking-widest transition-colors duration-300">
                            {isBreak ? 'Break Period' : 'Work Period'}
                        </p>
                    </div>
                </div>

                {/* Focus Task Input */}
                <div className="w-full max-w-md mb-8 animate-slide-up" style={{ animationDelay: '50ms' }}>
                    <div className={`relative flex items-center bg-slate-900/50 backdrop-blur-xl border rounded-xl transition-all duration-300 ${isTaskSet ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-slate-800/50 hover:border-purple-500/30'}`}>
                        <div className="pl-4">
                            {isTaskSet ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-slate-500" />}
                        </div>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            disabled={isTaskSet || isActive}
                            placeholder="What are you working on?"
                            className="w-full bg-transparent border-none text-white placeholder:text-slate-500 focus:ring-0 py-4 px-4 text-center font-medium"
                            onKeyDown={(e) => e.key === 'Enter' && task && setIsTaskSet(true)}
                        />
                        {isTaskSet && !isActive && (
                            <button
                                onClick={() => setIsTaskSet(false)}
                                className="absolute right-2 p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Main Timer */}
                    <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-12 shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-500 relative overflow-hidden">
                            {/* Ambient Sound Indicator */}
                            {activeSound && (
                                <div className="absolute top-6 left-6 flex items-center gap-2 text-purple-400 animate-fade-in">
                                    <Volume2 className="w-4 h-4 animate-pulse" />
                                    <span className="text-xs uppercase tracking-wider">{ambientSounds.find(s => s.id === activeSound)?.name} Sound</span>
                                </div>
                            )}

                            {/* Music Player Indicator */}
                            {isPlaying && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 text-purple-400 animate-fade-in">
                                    <Music className="w-4 h-4 animate-bounce" />
                                    <span className="text-xs uppercase tracking-wider truncate max-w-[150px]">{tracks[currentTrackIndex].title}</span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <div className={`text-[8rem] md:text-[10rem] font-light text-white leading-none tracking-tight mb-8 transition-all duration-300 ${isActive ? 'scale-105 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]' : ''}`}>
                                    {String(minutes).padStart(2, '0')}
                                    <span className="text-slate-600 animate-pulse">:</span>
                                    {String(seconds).padStart(2, '0')}
                                </div>

                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-12">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isBreak ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={toggleTimer}
                                        className={`px-12 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${isActive
                                            ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg'
                                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                            <span>{isActive ? 'Pause' : 'Start'}</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all duration-300 hover:scale-105 hover:text-white hover:shadow-lg active:scale-95"
                                    >
                                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Ambient Sounds Control */}
                            <div className="flex justify-center gap-4 pt-8 border-t border-slate-800/50">
                                {ambientSounds.map((sound) => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
                                        className={`p-3 rounded-xl transition-all duration-300 ${activeSound === sound.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800/30 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                                        title={sound.name}
                                    >
                                        <sound.icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-amber-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Coins className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                                <p className="text-slate-400 text-sm uppercase tracking-wider group-hover:text-amber-400 transition-colors">Balance</p>
                            </div>
                            <p className="text-4xl font-light text-white group-hover:text-amber-100 transition-colors">{coins.toLocaleString()}</p>
                            <p className="text-slate-500 text-xs mt-1">Coins earned</p>
                        </div>

                        <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-slate-400 text-sm uppercase tracking-wider group-hover:text-purple-400 transition-colors">Sessions</p>
                            </div>
                            <p className="text-4xl font-light text-white group-hover:text-purple-100 transition-colors">{sessions}</p>
                            <p className="text-slate-500 text-xs mt-1">Completed today</p>
                        </div>

                        <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300 shadow-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-emerald-500 group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out" />
                                <p className="text-slate-400 text-sm uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Time</p>
                            </div>
                            <p className="text-4xl font-light text-white group-hover:text-emerald-100 transition-colors">{sessions * 25}</p>
                            <p className="text-slate-500 text-xs mt-1">Minutes focused</p>
                        </div>
                    </div>
                </div>

                {/* Music Player Modal */}
                {showMusicPlayer && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-scale-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-light text-white">Lo-Fi Playlist</h2>
                                <button onClick={() => setShowMusicPlayer(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Now Playing */}
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <Music className="w-6 h-6 text-white animate-pulse" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white font-medium truncate">{tracks[currentTrackIndex].title}</p>
                                        <p className="text-slate-400 text-xs">Now Playing</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <button onClick={prevTrack} className="text-slate-400 hover:text-white p-2">
                                        <Play className="w-4 h-4 rotate-180" />
                                    </button>
                                    <button
                                        onClick={toggleMusic}
                                        className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                    </button>
                                    <button onClick={nextTrack} className="text-slate-400 hover:text-white p-2">
                                        <Play className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Track List */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {tracks.map((track, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentTrackIndex(index);
                                            setIsPlaying(true);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentTrackIndex === index ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                                    >
                                        <span className="text-xs font-mono opacity-50 w-4">{index + 1}</span>
                                        <span className="text-sm font-medium truncate flex-1 text-left">{track.title}</span>
                                        {currentTrackIndex === index && isPlaying && (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <div className="w-0.5 bg-purple-400 animate-[pulse_0.6s_ease-in-out_infinite] h-2"></div>
                                                <div className="w-0.5 bg-purple-400 animate-[pulse_0.8s_ease-in-out_infinite] h-3"></div>
                                                <div className="w-0.5 bg-purple-400 animate-[pulse_1.0s_ease-in-out_infinite] h-1"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Modal */}
                {showSettings && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-scale-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-light text-white">Timer Settings</h2>
                                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Work Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={timerSettings.work}
                                        onChange={(e) => handleSettingChange('work', parseInt(e.target.value))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Short Break (minutes)</label>
                                    <input
                                        type="number"
                                        value={timerSettings.shortBreak}
                                        onChange={(e) => handleSettingChange('shortBreak', parseInt(e.target.value))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl transition-colors"
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AnimatedWrapper>
    );
}

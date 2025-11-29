import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '50%',
            left: '50%',
            animationDelay: '2s',
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        {/* Logo and Title */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo.jpg"
              alt="Zeno Logo"
              className="w-32 h-32 rounded-2xl shadow-2xl shadow-purple-500/50 animate-float"
            />
          </div>
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-transparent animate-gradient">
            ZENO
          </h1>
          <p className="text-2xl text-purple-200 font-light tracking-wide">
            Your Gateway to Collaborative Learning
          </p>
        </div>

        {/* Role Selection Cards */}
        <ScrollReveal width="100%" delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
            {/* User Card */}
            <button
              onClick={() => navigate('/login')}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-purple-300/20 p-8 transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:border-purple-300/40 hover:shadow-2xl hover:shadow-purple-500/50 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <GraduationCap className="w-16 h-16 text-purple-200 group-hover:text-purple-100 transition-colors duration-300" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 text-purple-100 text-center">Student</h2>
                <p className="text-purple-200/80 mb-6 text-lg text-center">
                  Access your study dashboard, connect with peers, and enhance your learning journey
                </p>

                <div className="flex items-center justify-center text-purple-300 group-hover:text-purple-100 transition-colors duration-300">
                  <span className="mr-2 font-semibold">Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-gradient-rotate" style={{ padding: '2px' }}>
                  <div className="w-full h-full rounded-2xl bg-purple-950/90" />
                </div>
              </div>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => navigate('/admin-login')}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-indigo-300/20 p-8 transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:border-indigo-300/40 hover:shadow-2xl hover:shadow-indigo-500/50 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                    <Shield className="w-16 h-16 text-indigo-200 group-hover:text-indigo-100 transition-colors duration-300" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 text-indigo-100 text-center">Administrator</h2>
                <p className="text-indigo-200/80 mb-6 text-lg text-center">
                  Manage the platform, oversee users, and maintain the learning ecosystem
                </p>

                <div className="flex items-center justify-center text-indigo-300 group-hover:text-indigo-100 transition-colors duration-300">
                  <span className="mr-2 font-semibold">Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-rotate" style={{ padding: '2px' }}>
                  <div className="w-full h-full rounded-2xl bg-purple-950/90" />
                </div>
              </div>
            </button>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal delay={0.4}>
          <div className="mt-16 text-center text-purple-300/60">
            <p className="text-sm">Empowering students through collaborative learning</p>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gradient-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-out 0.6s both;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-rotate {
          animation: gradient-rotate 3s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

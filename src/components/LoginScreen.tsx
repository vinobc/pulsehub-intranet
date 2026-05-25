import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types/user';

const personas = [
  {
    role: 'manager' as User['role'],
    name: 'Sarah Johnson',
    title: 'Manager - Engineering',
    tags: 'Team leadership, analytics, strategic overview',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    tagColor: 'text-blue-600 dark:text-blue-400',
    ringColor: 'ring-blue-400',
    icon: '👩‍💼',
  },
  {
    role: 'employee' as User['role'],
    name: 'Alex Chen',
    title: 'Employee - Engineering',
    tags: 'Task focus, collaboration, skill development',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    ringColor: 'ring-emerald-400',
    icon: '👨‍💻',
  },
  {
    role: 'new_hire' as User['role'],
    name: 'Jordan Smith',
    title: 'New Hire - Marketing',
    tags: 'Onboarding, learning, getting started',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50 dark:bg-violet-900/20',
    tagColor: 'text-violet-600 dark:text-violet-400',
    ringColor: 'ring-violet-400',
    icon: '🌱',
  },
];

export const LoginScreen = () => {
  const { login, isLoading } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleLogin = (role: User['role']) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200/30 dark:bg-violet-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`max-w-lg w-full space-y-8 relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-2">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            PulseHub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your modern intranet experience — choose a persona to begin
          </p>
        </div>

        {/* Persona cards */}
        <div className="space-y-3">
          {personas.map((persona, index) => (
            <button
              key={persona.role}
              onClick={() => handleLogin(persona.role)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={isLoading}
              className={`w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md p-5 text-left transition-all duration-300 disabled:opacity-50 border border-white/50 dark:border-gray-700/50
                ${hoveredIndex === index ? `shadow-xl -translate-y-1 ring-2 ${persona.ringColor}` : 'hover:shadow-lg'}
              `}
              style={{
                transitionDelay: visible ? `${index * 100}ms` : '0ms',
                opacity: visible ? 1 : 0,
                transform: visible ? (hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(20px)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={persona.img}
                    alt={persona.name}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br ${persona.gradient} flex items-center justify-center text-xs shadow-sm`}>
                    {persona.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{persona.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{persona.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {persona.tags.split(', ').map((tag) => (
                      <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${persona.lightBg} ${persona.tagColor}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 transition-all duration-300 ${hoveredIndex === index ? 'translate-x-1 text-gray-500 dark:text-gray-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Logging in...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          PulseHub v2.0 — Modern Corporate Intranet
        </p>
      </div>
    </div>
  );
};

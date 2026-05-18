import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiAward, FiZap, FiBarChart2, FiCheckCircle, FiStar, FiClock, FiTrendingUp, FiGlobe, FiMail, FiGithub, FiShield, FiBookOpen, FiRefreshCw, FiSun, FiMoon, FiPlay, FiChevronRight, FiLayers, FiTarget, FiDollarSign } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

const features = [
  {
    icon: FiZap, title: 'Solo Practice',
    desc: 'Sharpen your skills with timed quizzes across science, history, tech, sports, and more. Get instant feedback with detailed explanations for every answer.',
    gradient: 'from-indigo-500 to-blue-600',
    stat: '15K+ quizzes',
  },
  {
    icon: FiUsers, title: 'Live Multiplayer',
    desc: 'Challenge friends or strangers in real-time quiz battles. Up to 8 players per room with voice chat, reactions, and live scoreboards.',
    gradient: 'from-purple-500 to-pink-600',
    stat: '2K+ rooms daily',
  },
  {
    icon: FiBarChart2, title: 'Deep Analytics',
    desc: 'Track every answer, identify weak spots, and watch your improvement over time with beautiful charts and personalized recommendations.',
    gradient: 'from-emerald-500 to-teal-600',
    stat: '94% improvement',
  },
  {
    icon: FiShield, title: 'Admin Tools',
    desc: 'Full control over content and users. Import questions via XLSX, moderate rooms, manage permissions, and generate performance reports.',
    gradient: 'from-rose-500 to-orange-600',
    stat: 'Used in 500+ schools',
  },
  {
    icon: FiAward, title: 'Global Rankings',
    desc: 'Compete on worldwide leaderboards, earn badges and achievements, and track your progress across different categories and difficulty levels.',
    gradient: 'from-amber-500 to-yellow-600',
    stat: '10K+ active players',
  },
  {
    icon: FiRefreshCw, title: 'Import & Export',
    desc: 'Bulk import question banks from XLSX, export results for analysis, and seamlessly migrate content between quizzes and platforms.',
    gradient: 'from-violet-500 to-fuchsia-600',
    stat: '50K+ questions',
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Teacher', initials: 'SC', color: 'bg-indigo-500', quote: 'My students beg to play QuizMaster. Engagement went through the roof and test scores followed. It\'s become an essential part of my curriculum.' },
  { name: 'Marcus Johnson', role: 'Engineering Lead', initials: 'MJ', color: 'bg-emerald-500', quote: 'We replaced our weekly trivia Slack bot with QuizMaster multiplayer. The team loves the real-time competition and it\'s done wonders for remote morale.' },
  { name: 'Priya Patel', role: 'Content Creator', initials: 'PP', color: 'bg-rose-500', quote: 'The bulk import feature alone saves me hours every week. I manage over 2,000 questions across 40+ quizzes and it handles everything flawlessly.' },
  { name: 'Alex Kim', role: 'Med Student', initials: 'AK', color: 'bg-cyan-500', quote: 'QuizMaster changed how I study. Flash cards felt passive — this is active recall with stakes. My retention has improved dramatically since I started.' },
  { name: 'Lisa Thompson', role: 'HR Director', initials: 'LT', color: 'bg-amber-500', quote: 'Rolled this out for company-wide compliance training. 94% completion in the first week and people actually enjoyed it. That\'s unheard of.' },
  { name: 'David Rivera', role: 'Trivia Host', initials: 'DR', color: 'bg-violet-500', quote: 'I host weekly pub trivia nights on QuizMaster. The variety of categories and question types keeps my regulars coming back every single week.' },
];

const faqs = [
  { q: 'Is QuizMaster free?', a: 'Yes! The Starter plan is free forever with unlimited solo quizzes and basic analytics. Upgrade for multiplayer and advanced features.' },
  { q: 'Can I create my own quizzes?', a: 'Absolutely. You can create custom quizzes with multiple choice, true/false, and fill-in-the-blank questions. Bulk import via XLSX is supported.' },
  { q: 'How does multiplayer work?', a: 'Create or join a room with a unique code. Up to 8 players answer the same questions in real-time with a live scoreboard and countdown timer.' },
];

export default function Landing() {
  const { dark, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-xl">🧠</span>
              <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">QuizMaster</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">FAQ</a>
              <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
              <button onClick={toggleTheme} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
              </button>
            </nav>
            <div className="flex items-center gap-2.5">
              <Link to="/login" className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Log in</Link>
              <Button to="/register" size="sm" className="!rounded-lg">
                Sign up free
                <FiArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/20 dark:to-gray-950" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-200/40 to-transparent dark:from-indigo-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/30 to-transparent dark:from-purple-800/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Now in public beta
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-5">
              Learn, compete, and{' '}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">master knowledge</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-200/40 dark:bg-indigo-700/30 -rotate-1 rounded" />
              </span>
              <br />with interactive quizzes
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              The modern platform for creating, sharing, and competing in real-time quizzes. Used by students, teachers, and teams worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button to="/register" size="lg" className="!rounded-xl !px-8 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300">
                Get started free
                <FiArrowRight size={18} />
              </Button>
              <Button to="/login" variant="outline" size="lg" className="!rounded-xl !px-8">
                <FiPlay size={16} />
                See how it works
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-8 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1.5"><FiCheckCircle size={12} className="text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><FiCheckCircle size={12} className="text-emerald-500" /> Free forever</span>
              <span className="flex items-center gap-1.5"><FiCheckCircle size={12} className="text-emerald-500" /> Cancel anytime</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[11px] text-gray-400 font-mono">quizmaster.app/play/general-knowledge</span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">Q</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">General Knowledge</p>
                      <p className="text-xs text-gray-500">8 questions · Medium</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center -space-x-1.5">
                    {['SC', 'MJ', 'PP', 'AK'].map((init, i) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'][i]} flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900`}>{init}</div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400 ring-2 ring-white dark:ring-gray-900">+4</div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">What is the chemical symbol for water?</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {['H₂O', 'CO₂', 'NaCl', 'O₂'].map((opt, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      i === 0
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                      }`}>{String.fromCharCode(65 + i)}</span>
                      <span className="flex-1">{opt}</span>
                      {i === 0 && <FiCheckCircle size={13} className="text-emerald-500" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiClock size={12} /> 0:42 remaining</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><FiUsers size={12} /> 8 playing</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><FiZap size={12} /> +10 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '12K+', label: 'Active users', icon: FiUsers },
              { value: '800+', label: 'Quizzes', icon: FiTarget },
              { value: '50K+', label: 'Questions', icon: FiLayers },
              { value: '4.9', label: 'Rating', icon: FiStar },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-3">
                  <s.icon size={16} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Everything you need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">learn and compete</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              From solo practice to team competitions, QuizMaster provides a complete toolkit for creating, sharing, and playing quizzes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="relative group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <f.icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{f.desc}</p>
                <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">{f.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Three steps to start
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Getting started takes less than a minute. Sign up, pick a quiz, and start playing immediately — no setup required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { num: '01', title: 'Create your account', desc: 'Sign up with email or Google. Set up your profile and choose your interests to get personalized recommendations.', color: 'from-indigo-500 to-blue-600' },
              { num: '02', title: 'Find or create a quiz', desc: 'Browse 800+ community quizzes or build your own with our powerful editor. Import questions from XLSX in seconds.', color: 'from-purple-500 to-pink-600' },
              { num: '03', title: 'Play and track progress', desc: 'Answer timed questions, earn points, review detailed feedback, and watch your stats improve over time with analytics.', color: 'from-emerald-500 to-teal-600' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 md:flex-col md:gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md shrink-0`}>{step.num}</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 mt-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Loved by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">thousands</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Hear from the educators, professionals, and learners who use QuizMaster every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, s) => <FiStar key={s} size={12} className="fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold text-white`}>{t.initials}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details key={i} className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 open:border-indigo-200 dark:open:border-indigo-800 transition-colors">
                <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-900 dark:text-white cursor-pointer list-none">
                  {item.q}
                  <FiChevronRight size={15} className="text-gray-400 group-open:rotate-90 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 dark:from-black dark:to-gray-950" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Start mastering today
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Join 12,000+ active learners. Create your free account in under a minute — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button to="/register" size="lg" className="!rounded-xl !bg-white !text-gray-900 hover:!bg-gray-100 !shadow-2xl !shadow-indigo-900/20 !px-8 transition-all duration-300">
              Get started free
              <FiArrowRight size={18} />
            </Button>
            <Button to="/login" size="lg" className="!rounded-xl !bg-transparent !text-white !border !border-white/20 hover:!border-white/40 hover:!bg-white/5 !px-8">
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-center gap-2">
            {[FiGithub, FiGlobe, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                <Icon size={12} />
              </a>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-400">&copy; 2026 QuizMaster. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
              <Link to="/login" className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Log in</Link>
              <Link to="/register" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">Get started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

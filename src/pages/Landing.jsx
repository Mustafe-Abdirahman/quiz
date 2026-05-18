import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiAward, FiZap, FiBarChart2, FiClock, FiCheckCircle, FiStar, FiLayers, FiPlay, FiTrendingUp, FiGlobe, FiMail, FiGithub, FiShield, FiBookOpen, FiRefreshCw, FiHeart, FiChevronRight } from 'react-icons/fi';
import Button from '../components/ui/Button';

const features = [
  { icon: FiZap, title: 'Solo Mode', desc: 'Test your knowledge with timed quizzes across multiple categories with instant feedback and detailed explanations.', gradient: 'from-amber-500 to-orange-600' },
  { icon: FiUsers, title: 'Multiplayer', desc: 'Compete with friends in real-time. Up to 8 players per room with live scoreboards and exciting race modes.', gradient: 'from-indigo-500 to-purple-600' },
  { icon: FiAward, title: 'Leaderboards', desc: 'Track your global ranking, compare scores with peers, and earn badges for achievements and milestones.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: FiBarChart2, title: 'Analytics', desc: 'Deep insights into your performance with visual charts, progress tracking, and personalized improvement tips.', gradient: 'from-blue-500 to-cyan-600' },
  { icon: FiShield, title: 'Admin Panel', desc: 'Full control over quizzes, questions, and users with granular permissions and real-time moderation tools.', gradient: 'from-rose-500 to-pink-600' },
  { icon: FiRefreshCw, title: 'Import & Export', desc: 'Bulk import questions via XLSX, export results, and seamlessly migrate content between quizzes and platforms.', gradient: 'from-violet-500 to-fuchsia-600' },
];

const stats = [
  { value: '12K+', label: 'Active Learners', icon: FiUsers },
  { value: '800+', label: 'Quizzes Created', icon: FiBookOpen },
  { value: '75K+', label: 'Questions Answered', icon: FiTrendingUp },
  { value: '4.9', label: 'Average Rating', icon: FiStar },
];

const steps = [
  { num: '01', title: 'Create an Account', desc: 'Sign up in seconds and set up your profile. No credit card required.', color: 'from-indigo-500 to-purple-600' },
  { num: '02', title: 'Pick Your Quiz', desc: 'Browse hundreds of quizzes across science, history, tech, sports, and more.', color: 'from-purple-500 to-pink-600' },
  { num: '03', title: 'Start Playing', desc: 'Answer questions against the clock, earn points, and climb the leaderboard.', color: 'from-pink-500 to-rose-600' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'High School Teacher', avatar: 'SC', gradient: 'from-indigo-500 to-purple-600', quote: 'QuizMaster transformed my classroom. Student engagement is at an all-time high and test scores have improved dramatically.' },
  { name: 'Marcus Johnson', role: 'Engineering Manager', avatar: 'MJ', gradient: 'from-emerald-500 to-teal-600', quote: 'We use QuizMaster for weekly team-building. The multiplayer mode keeps remote teams connected and competitive.' },
  { name: 'Priya Patel', role: 'Content Creator', avatar: 'PP', gradient: 'from-rose-500 to-pink-600', quote: 'The analytics and question management save me hours every week. The import/export feature is a lifesaver.' },
  { name: 'Alex Kim', role: 'University Student', avatar: 'AK', gradient: 'from-cyan-500 to-blue-600', quote: 'Finally, a quiz app that makes studying fun. The instant feedback helps me learn from my mistakes right away.' },
  { name: 'Lisa Thompson', role: 'Corporate Trainer', avatar: 'LT', gradient: 'from-amber-500 to-orange-600', quote: 'We rolled out QuizMaster across our entire org for compliance training. Adoption was 94% in the first week.' },
  { name: 'David Rivera', role: 'Quiz Enthusiast', avatar: 'DR', gradient: 'from-violet-500 to-fuchsia-600', quote: 'I spend hours on QuizMaster every week. The variety of topics and the competitive aspect keep me coming back.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">🧠</span>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">QuizMaster</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Log in</Link>
              <Button to="/register" size="sm" className="!rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300">
                Get Started
                <FiArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-white to-transparent dark:from-indigo-950/40 dark:via-gray-950 dark:to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-950/30 dark:via-transparent dark:to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-[96px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-medium text-white shadow-lg shadow-indigo-500/25 mb-6 animate-fadeIn">
                <FiZap size={14} />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Now available for everyone
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.05] tracking-tight">
                Master your knowledge with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">interactive quizzes</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                The all-in-one platform for learners, educators, and teams. Create, share, and compete in real-time with stunning analytics and seamless multiplayer.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button to="/register" size="lg" className="!rounded-full !px-8 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5">
                  Start Free
                  <FiArrowRight size={18} />
                </Button>
                <Button to="/login" variant="outline" size="lg" className="!rounded-full !px-8">
                  <FiPlay size={16} />
                  Watch Demo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
                {['No credit card required', 'Free forever', 'Instant access', 'Cancel anytime'].map((text, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <FiCheckCircle size={14} className="text-emerald-500 shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* HERO CARD */}
            <div className="hidden lg:flex justify-center">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-40 group-hover:opacity-60 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-1 group-hover:-translate-y-1 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/80 rounded-2xl p-1">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">Q</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">General Knowledge</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>8 questions</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            <span>Medium</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                          {['SC', 'MJ', 'PP'].map((init, i) => (
                            <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600'][i]} flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900`}>
                              {init}
                            </div>
                          ))}
                          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 ring-2 ring-white dark:ring-gray-900">+5</div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">8 players competing</span>
                      </div>

                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">What is the chemical symbol for water?</p>
                      <div className="space-y-2.5">
                        {[
                          { text: 'H₂O', correct: true },
                          { text: 'CO₂', correct: false },
                          { text: 'NaCl', correct: false },
                          { text: 'O₂', correct: false },
                        ].map((opt, i) => (
                          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                            opt.correct
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700'
                              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              opt.correct
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {opt.correct && (
                              <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <FiCheckCircle size={11} className="text-white" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <FiClock size={12} />
                          <span>0:42 remaining</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          <FiZap size={12} />
                          <span>+10 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center text-2xl animate-bounce shadow-amber-500/30" style={{ animationDuration: '3s' }}>🏆</div>
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center text-xl animate-bounce shadow-rose-500/30" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>⚡</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      </section>

      {/* STATS BANNER */}
      <section className="relative -mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800/50 p-8 md:p-12 hover:shadow-[0_8px_40px_-8px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_8px_40px_-8px_rgba(99,102,241,0.08)] transition-shadow duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((s, i) => (
                <div key={i} className="text-center group">
                  <div className="inline-flex p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                    <s.icon size={20} />
                  </div>
                  <p className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full text-sm font-medium text-white shadow-lg shadow-violet-500/25 mb-4">
              <FiLayers size={14} />
              Simple workflow
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Get started in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">three steps</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              From zero to quizzing in under a minute. Simple enough for anyone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-900/50 dark:to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white text-xl font-bold shadow-lg mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 text-gray-300 dark:text-gray-700">
                    <FiChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28 bg-gray-50/80 dark:bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-medium text-white shadow-lg shadow-indigo-500/25 mb-4">
              <FiZap size={14} />
              Everything you need
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Powerful features for<br />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">modern learning</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              From solo practice to team competitions, every tool you need in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div key={i} className="group relative bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-7 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${feat.gradient} text-white shadow-lg shadow-${feat.gradient.split(' ')[0].replace('from-', '')}/20 mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2.5">{feat.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-sm font-medium text-white shadow-lg shadow-amber-500/25 mb-4">
              <FiHeart size={14} />
              Loved by thousands
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              What our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400">users</span> say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Real feedback from real people who use QuizMaster every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, s) => <FiStar key={s} size={14} className="fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-pink-900/90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6">
            <FiStar size={14} />
            Join 12,000+ active learners
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Ready to challenge<br />yourself?
          </h2>
          <p className="text-lg text-indigo-200 mb-10 max-w-lg mx-auto leading-relaxed">
            Join thousands of users already mastering their knowledge. Start your journey today — it&apos;s free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/register" size="lg" className="!rounded-full !bg-white !text-indigo-700 hover:!bg-indigo-50 !shadow-2xl !shadow-indigo-900/25 !px-10 hover:-translate-y-0.5 transition-all duration-300">
              Get Started Free
              <FiArrowRight size={18} />
            </Button>
            <Button to="/login" size="lg" className="!rounded-full !bg-transparent !text-white !border-2 !border-white/30 hover:!border-white/50 hover:!bg-white/10 !px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 dark:bg-black border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🧠</span>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">QuizMaster</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                The ultimate quiz platform for learners, educators, and teams. Create, share, and compete in real-time.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: FiGithub, href: 'https://github.com' },
                  { icon: FiGlobe, href: '#' },
                  { icon: FiMail, href: 'mailto:hello@quizmaster.app' },
                ].map((item, i) => (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                    <item.icon size={15} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'Status', 'Community', 'Tutorials'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-white/90 mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 QuizMaster, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Log in</Link>
              <Link to="/register" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

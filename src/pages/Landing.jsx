import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiAward, FiZap, FiShield, FiBarChart2, FiClock, FiCheckCircle, FiStar, FiLayers, FiPlay, FiTrendingUp, FiGlobe, FiCode, FiMail, FiGithub } from 'react-icons/fi';
import Button from '../components/ui/Button';

const features = [
  { icon: FiZap, title: 'Solo Mode', desc: 'Test your knowledge with timed quizzes across multiple categories with instant feedback.', gradient: 'from-amber-500 to-orange-600' },
  { icon: FiUsers, title: 'Multiplayer', desc: 'Compete with friends in real-time quiz competitions. Up to 8 players per room.', gradient: 'from-indigo-500 to-purple-600' },
  { icon: FiAward, title: 'Leaderboards', desc: 'Track rankings and compare scores with players worldwide.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: FiBarChart2, title: 'Analytics', desc: 'Track performance with detailed charts, insights, and progress reports.', gradient: 'from-blue-500 to-cyan-600' },
  { icon: FiShield, title: 'Admin Control', desc: 'Full quiz and user management with role-based access control.', gradient: 'from-rose-500 to-pink-600' },
  { icon: FiGlobe, title: 'Categories', desc: 'Diverse topics from science to sports. Always something new to learn.', gradient: 'from-violet-500 to-fuchsia-600' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: FiUsers },
  { value: '500+', label: 'Quizzes', icon: FiLayers },
  { value: '50K+', label: 'Questions', icon: FiTrendingUp },
  { value: '4.9', label: 'User Rating', icon: FiStar },
];

const tiers = [
  {
    name: 'Starter', price: 'Free', popular: false,
    features: ['Up to 5 quizzes', 'Solo mode', 'Basic stats', 'Community access'],
    cta: 'Get Started', to: '/register',
  },
  {
    name: 'Pro', price: '$9', period: '/mo', popular: true,
    features: ['Unlimited quizzes', 'Multiplayer mode', 'Advanced analytics', 'Admin panel', 'Priority support'],
    cta: 'Start Free Trial', to: '/register',
  },
  {
    name: 'Enterprise', price: '$29', period: '/mo', popular: false,
    features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated support', 'Team management'],
    cta: 'Contact Sales', to: '/register',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🧠</span>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">QuizMaster</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Testimonials</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Log in</Link>
              <Button to="/register" size="sm" className="!rounded-full">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-transparent dark:from-indigo-950/40 dark:via-gray-950 dark:to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-medium text-white shadow-lg shadow-indigo-500/25 mb-6">
                <FiZap size={14} />
                Now available for teams
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Master your knowledge with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">interactive quizzes</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Create, share, and compete in real-time. The all-in-one platform for learners, educators, and teams who take knowledge seriously.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button to="/register" size="lg" className="!rounded-full !px-8 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300">
                  Get Started Free
                  <FiArrowRight size={18} />
                </Button>
                <Button to="/login" variant="outline" size="lg" className="!rounded-full !px-8">
                  <FiPlay size={16} />
                  Watch Demo
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
                {['No credit card', 'Free forever', 'Instant access'].map((text, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <FiCheckCircle size={14} className="text-emerald-500 shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-full max-w-[500px]">
                <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-indigo-500/25 p-1">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">Q</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">General Knowledge</p>
                        <p className="text-xs text-gray-500">8 questions &middot; Medium</p>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">Live</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">What is the chemical symbol for water?</p>
                    {['H2O', 'CO2', 'NaCl', 'O2'].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl mb-2 text-sm font-medium transition-colors ${i === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>{String.fromCharCode(65 + i)}</span>
                        {opt}
                        {i === 0 && <FiCheckCircle size={14} className="ml-auto text-emerald-500 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-amber-400 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🏆</div>
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-rose-400 rounded-2xl shadow-lg flex items-center justify-center text-xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>⚡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((s, i) => (
                <div key={i} className="text-center group">
                  <div className="inline-flex p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <s.icon size={18} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-28 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-medium text-white mb-4">
              <FiLayers size={14} />
              Everything you need
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Powerful features for<br />modern learning
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              From solo practice to team competitions, QuizMaster has every tool you need.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div key={i} className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:border-transparent dark:hover:border-gray-700 transition-all duration-500 hover:-translate-y-1">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feat.gradient} text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feat.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-sm font-medium text-white mb-4">
              <FiStar size={14} />
              Simple pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Choose the right plan for you
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start free, upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <div key={i} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${tier.popular ? 'bg-indigo-600 dark:bg-indigo-700 shadow-2xl shadow-indigo-500/25 scale-105 border-0' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-xs font-bold px-4 py-1 rounded-full shadow-lg">Most Popular</div>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${tier.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-0.5 mb-6">
                  <span className={`text-4xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{tier.price}</span>
                  {tier.period && <span className={`text-sm ${tier.popular ? 'text-indigo-200' : 'text-gray-400'}`}>{tier.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2.5 text-sm ${tier.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      <FiCheckCircle size={14} className={tier.popular ? 'text-white shrink-0' : 'text-emerald-500 shrink-0'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button to={tier.to} className={`w-full !rounded-xl ${tier.popular ? '!bg-white !text-indigo-700 hover:!bg-indigo-50' : ''}`} variant={tier.popular ? 'primary' : 'outline'}>
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 md:py-28 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-sm font-medium text-white mb-4">
              <FiStar size={14} />
              Trusted by thousands
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              What our users say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real feedback from real people.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'High School Teacher', avatar: 'SC', quote: 'QuizMaster transformed my classroom. Student engagement is at an all-time high and test scores have improved dramatically.', stars: 5 },
              { name: 'Marcus Johnson', role: 'Engineering Manager', avatar: 'MJ', quote: 'We use QuizMaster for weekly team-building. The multiplayer mode keeps remote teams connected and competitive in the best way.', stars: 5 },
              { name: 'Priya Patel', role: 'Content Creator', avatar: 'PP', quote: 'The analytics and question management save me hours every week. The import/export feature is a lifesaver for bulk operations.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[...Array(t.stars)].map((_, s) => <FiStar key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
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

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800" />
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Ready to challenge yourself?
          </h2>
          <p className="text-lg text-indigo-200 mb-10 max-w-lg mx-auto leading-relaxed">
            Join thousands of users already mastering their knowledge. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/register" size="lg" className="!rounded-full !bg-white !text-indigo-700 hover:!bg-indigo-50 !shadow-2xl !shadow-indigo-900/25 !px-8">
              Get Started Free
              <FiArrowRight size={18} />
            </Button>
            <Button to="/login" size="lg" className="!rounded-full !bg-transparent !text-white !border-2 !border-white/30 hover:!border-white/50 hover:!bg-white/10 !px-8">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 dark:bg-black border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <span className="text-lg font-bold text-white">QuizMaster</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                The ultimate quiz platform for learners, educators, and teams. Create, share, and compete in real-time.
              </p>
              <div className="flex items-center gap-3">
                {[FiGithub, FiGlobe, FiMail].map((Icon, i) => (
                  <a key={i} href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'Status', 'Community'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 QuizMaster, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Log in</Link>
              <Link to="/register" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

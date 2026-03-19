import { ArrowRight, ShieldCheck, BarChart3, Settings, Wrench } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      {/* 🔥 Navbar */}
      <header className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">PeopleDesk</h1>

        <nav className="flex items-center gap-6">
          <a href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-800">
            Signup
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-blue-100 to-purple-100">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Smart IT Asset Management
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Track, manage, and optimize your assets with a powerful and intuitive platform built for modern teams.
        </p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Get Started <ArrowRight size={18} />
          </a>

          <a
            href="/sign-up"
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Create Account
          </a>
        </div>
      </section>

      {/* ⭐ Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <ShieldCheck className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">Asset Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor asset location, status, and lifecycle in real-time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <BarChart3 className="text-purple-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">Reports & Analytics</h3>
              <p className="text-gray-600 text-sm">
                Generate reports and gain insights into asset usage.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <Wrench className="text-green-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">Maintenance</h3>
              <p className="text-gray-600 text-sm">
                Schedule maintenance and track service history easily.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <Settings className="text-orange-500 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">Custom Settings</h3>
              <p className="text-gray-600 text-sm">
                Configure the platform according to your business needs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🎯 CTA Section */}
      <section className="bg-blue-600 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Managing Your Assets Today
        </h2>
        <p className="mb-6 text-blue-100">
          Join thousands of teams using AssetPro to stay organized and efficient.
        </p>

        <a
          href="/sign-up"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started Free
        </a>
      </section>

      {/* 🔻 Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-auto">
        © 2026 AssetPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Hero;
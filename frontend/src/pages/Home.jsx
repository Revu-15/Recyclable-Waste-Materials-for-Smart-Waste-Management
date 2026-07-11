import React from 'react';
import { Camera, BarChart3, Database, ShieldAlert, Cpu, Eye, Leaf, FileText, Users, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Home = ({ setActiveTab }) => {
  const features = [
    { icon: Cpu, title: 'Transfer Learning Core', desc: 'Pre-trained MobileNetV2 architecture fine-tuned specifically for classification of complex household recyclable materials.' },
    { icon: Eye, title: 'Explainable AI (Grad-CAM)', desc: 'Real-time Gradient-weighted Class Activation Mapping to visualize and trace exactly where the model focuses to make predictions.' },
    { icon: FileText, title: 'Automated Reporting', desc: 'Downloadable PDF reports for individual predictions containing confidence histograms, environmental recommendations, and XAI plots.' },
    { icon: Database, title: 'Analytics & Log History', desc: 'Persistent SQLite transaction logging with search, deletions, and batch exporting to Excel (.xlsx) and CSV sheets.' }
  ];

  const datasetClasses = [
    { name: 'Plastic', count: '700+', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Paper', count: '750+', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { name: 'Cardboard', count: '570+', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    { name: 'Glass', count: '620+', color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' },
    { name: 'Metal', count: '560+', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
    { name: 'Organic Waste', count: '810+', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { name: 'Clothes', count: '450+', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    { name: 'Battery', count: '370+', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    { name: 'Electronic Waste', count: '410+', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
    { name: 'Trash', count: '500+', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 overflow-y-auto max-h-[calc(100vh-100px)] px-2">
      {/* Hero Section */}
      <GlassCard className="relative overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border-emerald-500/10">
        <div className="flex-1 flex flex-col items-start gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Academic B.Tech Major Capstone
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-800 dark:text-white">
            Deep Learning for <br />
            <span className="sustainability-gradient-text">Smart Waste Classification</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
            An intelligent full-stack system utilizing deep neural networks to automate recyclable waste identification, generate explainable visual heatmaps (Grad-CAM), and deliver actionable environmental disposal advice.
          </p>
          <button 
            onClick={() => setActiveTab('classify')}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl sustainability-gradient-bg text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300"
          >
            <span>Launch Classification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Floating Abstract Artwork */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/10 animate-float"></div>
          <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-teal-500/10 bg-teal-500/5 dark:bg-teal-500/10 animate-pulse"></div>
          <Leaf className="w-24 h-24 text-emerald-600/80 dark:text-emerald-400/80 animate-bounce" />
        </div>
      </GlassCard>

      {/* Feature Grid */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white px-1">Key Research Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={index} className="p-5 flex flex-col gap-3 hover:border-emerald-500/20">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{feat.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Dataset & Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Supported Waste Materials</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Classified using consolidated Garbage Classification and TrashNet distributions.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {datasetClasses.map((cls, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.03] ${cls.color}`}
              >
                <span className="text-xs font-bold whitespace-nowrap">{cls.name}</span>
                <span className="text-[10px] opacity-80">{cls.count} images</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Presentation Metadata */}
        <GlassCard className="p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Academic Details</h3>
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between py-2 border-b border-glass-dark dark:border-glass-light">
              <span className="text-slate-500">Degree</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">B.Tech Computer Science</span>
            </div>
            <div className="flex justify-between py-2 border-b border-glass-dark dark:border-glass-light">
              <span className="text-slate-500">Specialization</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Data Science</span>
            </div>
            <div className="flex justify-between py-2 border-b border-glass-dark dark:border-glass-light">
              <span className="text-slate-500">Deep Learning Model</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">MobileNetV2 (Transfer Learning)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">XAI Technique</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Grad-CAM (PyTorch backprop)</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Project Team */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white px-1">Project Development Group</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full sustainability-gradient-bg text-white flex items-center justify-center font-bold text-lg">
              DS
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Lead DL Engineer</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Research & Model Training</p>
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg">
              FS
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Full-Stack Architect</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">API Backend & UI Assembly</p>
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg">
              UX
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">UI/UX Designer</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Glassmorphic Components & Assets</p>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Home;

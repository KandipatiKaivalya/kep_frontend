import React, { useEffect, useRef, useState } from 'react';
import { 
  ShieldCheck, Award, Landmark, GraduationCap, 
  ExternalLink, Globe, Star, CheckCircle, 
  Users, Building2, Trophy, ArrowRight, CheckCircle2,
  Cpu, Zap, Shield, Heart, Flag, Smartphone
} from 'lucide-react';
import { ASSETS } from '../assets.ts';
import { COMPANY_INFO } from '../constants.tsx';

// 1. Reveal Component
const Reveal: React.FC<{ children: React.ReactNode; className?: string; type?: 'up' | 'left' | 'right'; delay?: string }> = ({ children, className = '', type = 'up', delay = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsActive(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const revealClass = type === 'up' ? 'reveal-up' : type === 'left' ? 'reveal-left' : 'reveal-right';

  return (
    <div ref={ref} className={`reveal ${revealClass} ${isActive ? 'active' : ''} ${delay} ${className}`}>
      {children}
    </div>
  );
};

// 2. Counter Component
const Counter: React.FC<{ target: string; duration?: number }> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  
  const numericPart = parseInt(target.replace(/[^0-9]/g, ''), 10);
  const suffix = target.replace(/[0-9,]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.2 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * numericPart));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, numericPart, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Impact: React.FC = () => {
  const accreditations = [
    { name: "APSSDC Skill AP", logo: ASSETS.LOGOS.APSSDC },
    { name: "MSME India", logo: ASSETS.LOGOS.MSME },
    { name: "Startup India", logo: ASSETS.LOGOS.STARTUP_INDIA },
    { name: "ISO 9001", logo: ASSETS.LOGOS.ISO },
    { name: "AICTE India", logo: ASSETS.LOGOS.AICTE },
    { name: "MCA", logo: ASSETS.LOGOS.MCA },
    { name: "NSDC India", logo: ASSETS.LOGOS.NSDC }
  ];

  const trustedBy = [
    { name: "IIT Madras", logo: ASSETS.LOGOS.IIT_MADRAS },
    { name: "Infosys Springboard", logo: ASSETS.LOGOS.INFOSYS },
    { name: "Great Learning", logo: ASSETS.LOGOS.GREAT_LEARNING },
    { name: "IDPS Narasaraopet", logo: ASSETS.LOGOS.IDPS_NARA },
    { name: "Ugyan Edu tech", logo: ASSETS.LOGOS.UGYAN },
    { name: "Code tree Solutions", logo: ASSETS.LOGOS.CODE_TREE },
    { name: "Flyhii private limited", logo: ASSETS.LOGOS.FLYHII },
    { name: "MAM Colleges", logo: ASSETS.LOGOS.MAM_COLLEGES }
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <style>{`
        /* Faster speeds (15s) and parallel directions */
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 15s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 15s linear infinite;
        }
        .marquee-mask {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        /* Reveal Animations */
        .reveal { opacity: 0; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; }
        .reveal-up { transform: translateY(40px); }
        .reveal-up.active { transform: translateY(0); }

        /* Tech-Grid Background */
        .tech-bg {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 30px 30px;
        }

        @keyframes energy-flow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
        .energy-line-h {
          position: absolute;
          height: 1px;
          width: 30%;
          background: linear-gradient(90deg, transparent, #ff9800, transparent);
          animation: energy-flow 8s linear infinite;
        }
      `}</style>

      {/* Hero Tier */}
      <div className="relative py-48 bg-[#001a33] text-center overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <Reveal>
            <div className="inline-flex items-center space-x-3 bg-white/10 border border-white/20 px-8 py-3 rounded-full mb-10 backdrop-blur-md">
              <ShieldCheck size={18} className="text-[#ff9800]" />
              <span className="text-white font-black tracking-[0.4em] uppercase text-[10px]">Institutional Track Record</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.85]">
              Verified <br/><span className="text-[#ff9800] italic">Impact.</span>
            </h1>
            <p className="text-gray-400 text-2xl font-medium max-w-4xl mx-auto italic leading-relaxed">
              Standardizing technical excellence across India's premier educational landscape. 
              Over <span className="text-white"><Counter target="5,000+" /></span> Students Trained.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Approved By Section (SCROLLING RIGHT - FASTER) */}
      <section className="relative py-24 bg-gray-50 tech-bg border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <Reveal type="left">
            <div className="flex items-center space-x-4">
               <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
               <h3 className="text-4xl font-black text-[#001a33] uppercase tracking-tighter">Approved <span className="text-blue-700 italic">By.</span></h3>
            </div>
          </Reveal>
        </div>

        <div className="relative marquee-mask overflow-hidden w-full flex items-center bg-white/50 py-4 border-y border-gray-200">
          <div className="flex animate-marquee-right gap-12 whitespace-nowrap">
            {[...accreditations, ...accreditations, ...accreditations].map((brand, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[250px] flex items-center justify-center p-6 transition-transform hover:scale-110">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-16 md:h-20 object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Trusted By Section (SCROLLING LEFT - FASTER) */}
      <section className="relative py-24 bg-gray-50 tech-bg overflow-hidden border-y border-gray-100">
        <div className="container mx-auto px-6 mb-12 text-right">
          <Reveal type="right">
              <div className="flex items-center justify-end space-x-4 space-x-reverse">
                <div className="h-10 w-2 bg-[#ff9800] rounded-full"></div>
                <h3 className="text-4xl md:text-6xl font-black text-[#001a33] uppercase tracking-tighter">Trusted <span className="text-[#ff9800] italic">By.</span></h3>
              </div>
          </Reveal>
        </div>

        <div className="relative marquee-mask overflow-hidden w-full flex items-center bg-white/50 py-4 border-y border-gray-200">
          <div className="flex animate-marquee-left gap-12 whitespace-nowrap">
            {[...trustedBy, ...trustedBy, ...trustedBy].map((brand, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[250px] flex items-center justify-center p-6 transition-transform hover:scale-110">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-16 md:h-20 object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Numerical Impact Matrix */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: 'Students Trained', value: '5,000+', icon: Users, desc: 'Verified technical skillsets deployed into the global workforce.' },
              { label: 'Institutional Partners', value: '25+', icon: Building2, desc: 'Schools and Colleges enabled with high-end technology labs.' },
              { label: 'NEP 2020 Aligned', value: '100%', icon: ShieldCheck, desc: 'All programs following the latest national education protocols.' }
            ].map((stat, i) => (
              <Reveal key={i} type="up" delay={`delay-${i * 100}`}>
                <div className="p-16 rounded-[3rem] bg-gray-50 border-l-[10px] border-[#0056b3] hover:-translate-y-4 transition-all group h-full shadow-sm hover:shadow-2xl overflow-hidden relative">
                   <div className="bg-[#0056b3] w-20 h-20 rounded-2xl flex items-center justify-center mb-10 shadow-xl relative z-10">
                      <stat.icon size={24} className="text-white" />
                   </div>
                   <h4 className="text-6xl font-black mb-6 tracking-tighter text-[#001a33] relative z-10">
                     <Counter target={stat.value} />
                   </h4>
                   <p className="text-[#ff9800] font-black uppercase text-xs tracking-widest mb-6 relative z-10">{stat.label}</p>
                   <p className="text-gray-500 font-medium leading-relaxed relative z-10">{stat.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social Mission Section */}
      <section className="py-48 bg-[#001a33] text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <Reveal type="up" className="flex flex-col items-center">
            <div className="inline-flex items-center space-x-3 bg-[#ff9800]/10 border border-[#ff9800]/20 px-6 py-2 rounded-full mb-8 backdrop-blur-md">
              <Heart size={16} className="text-[#ff9800] animate-pulse" />
              <span className="text-[#ff9800] font-black tracking-[0.3em] uppercase text-[10px]">Social Impact Protocol</span>
            </div>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase mb-16 leading-none">
              Social <span className="text-[#ff9800] italic">Mission.</span>
            </h2>
            <div className="max-w-4xl mx-auto bg-white/5 p-16 md:p-24 rounded-[4rem] border border-white/10 backdrop-blur-xl relative group transition-all duration-700 hover:scale-[1.02]">
              <p className="text-2xl md:text-4xl font-bold leading-tight text-gray-200 relative z-10">
                <span className="text-[#ff9800] text-6xl font-serif absolute -left-6 -top-4 opacity-50">"</span>
                We are dedicated to <span className="text-white underline decoration-[#ff9800]/50 underline-offset-8">reducing the rural–urban digital divide</span> and empowering government school students with the same tech stack used in top-tier institutions.
                <span className="text-[#ff9800] text-6xl font-serif absolute -right-4 bottom-0 opacity-50 translate-y-6">"</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Impact;
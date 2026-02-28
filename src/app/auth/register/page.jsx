'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, Compass, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les sceaux de sécurité ne correspondent pas (mots de passe différents).');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Votre clé doit comporter au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Échec de l'enregistrement du voyageur.");
        return;
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/onboarding');
      } else {
        setError(signInResult?.error || 'Connexion automatique échouée.');
      }
    } catch (err) {
      setError('Un obstacle imprévu bloque votre inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4e4bc] flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Éléments de fond décoratifs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] border-[1px] border-[#c7a667]/20 rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] border-[1px] border-[#c7a667]/20 rounded-full" />

      {/* Carte d'Invitation / Inscription */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#fffdf5] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[1px] border-[#e2d1a4] overflow-hidden">
        
        {/* Section Image : Identique au Login pour la cohérence */}
        <div className="relative hidden md:block group">
          <img
            src="/assests/robot.png"
            alt="Exploration Tunisie"
            className="h-full w-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fffdf5]" />
          
  
        </div>

        {/* Section Formulaire */}
        <div className="relative p-10 md:p-16 flex flex-col justify-center">
          {/* Ornements de coins */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c7a667] rounded-tl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c7a667] rounded-br-xl" />

          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-[#5d4037] mb-2">Laissez-passer</h1>
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-[#c7a667] to-transparent mx-auto mb-3" />
            <p className="text-[#8d6e63] font-serif italic">
              "Inscrivez votre nom dans les annales du voyage"
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom Complet */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">Nom du Voyageur</label>
              <div className="flex items-center">
                <User size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom complet"
                  className="w-full bg-transparent py-2 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40 font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">Courrier de Liaison</label>
              <div className="flex items-center">
                <Mail size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full bg-transparent py-2 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40 font-medium"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">Clé Secrète</label>
              <div className="flex items-center">
                <Lock size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40"
                />
              </div>
            </div>

            {/* Confirmation Mot de passe */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">Confirmation de la Clé</label>
              <div className="flex items-center">
                <ShieldCheck size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40"
                />
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-[#c7a667] hover:bg-[#5d4037] text-white py-4 rounded-full font-serif text-lg tracking-widest transition-all duration-300 shadow-lg mt-4 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : "Obtenir mon Laissez-passer"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#8d6e63] font-serif text-sm">
              Déjà inscrit parmi nous ?{' '}
              <Link 
                href="/auth/login" 
                className="font-bold text-[#c7a667] hover:text-[#5d4037] underline decoration-dotted"
              >
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
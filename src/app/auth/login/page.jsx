'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Lock, Mail, Loader2, Compass } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("L'accès au trésor est refusé. Vérifiez vos accès.");
      } else if (result?.ok) {
        // Check if user has completed onboarding by fetching their preferences
        try {
          const preferencesResponse = await fetch('/api/preferences');
          if (preferencesResponse.ok) {
            const prefData = await preferencesResponse.json();
            // If user has preferences, redirect to recommendations
            if (prefData.preferences) {
              router.push('/recommendations');
            } else {
              // Otherwise, send to onboarding
              router.push('/onboarding');
            }
          } else {
            // If we can't check, default to onboarding (safest for new users)
            router.push('/onboarding');
          }
        } catch (err) {
          // Default to onboarding if preference check fails
          router.push('/onboarding');
        }
      }
    } catch (err) {
      setError('Un obstacle empêche votre voyage. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4e4bc] flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Décoration de fond (Cercles/Boussole subtile) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] border-[1px] border-[#c7a667]/20 rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] border-[1px] border-[#c7a667]/20 rounded-full" />

      {/* Carte d'Invitation Principale */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#fffdf5] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[1px] border-[#e2d1a4] overflow-hidden">
        
        {/* Section Image : Invitation Visuelle */}
        <div className="relative hidden md:block group">
          <img
            src="/assests/robot.png"
            alt="Tourism Tunisia"
            className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fffdf5]" />
          
          
        </div>

        {/* Section Formulaire : Style Papier Ancien */}
        <div className="relative p-10 md:p-20 flex flex-col justify-center">
          {/* Ornements de coins (SVG) */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c7a667] rounded-tl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c7a667] rounded-br-xl" />

          <div className="text-center mb-10">
            <h1 className="text-5xl font-serif text-[#5d4037] mb-4">Invitation</h1>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#c7a667] to-transparent mx-auto mb-4" />
            <p className="text-[#8d6e63] font-serif italic text-lg">
              "Découvrez les trésors cachés de la Tunisie"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">
                Identifiant du Voyageur
              </label>
              <div className="flex items-center">
                <Mail size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full bg-transparent py-3 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40 font-medium"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="relative border-b-2 border-[#e2d1a4] focus-within:border-[#c7a667] transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#b8935a] ml-1">
                Clé de Passage
              </label>
              <div className="flex items-center">
                <Lock size={18} className="text-[#c7a667] mr-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 outline-none text-[#5d4037] placeholder:text-[#8d6e63]/40"
                />
              </div>
            </div>

            {/* Bouton doré façon sceau royal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-[#c7a667] hover:bg-[#5d4037] text-white py-4 rounded-full font-serif text-xl tracking-widest transition-all duration-300 shadow-[0_10px_20px_rgba(199,166,103,0.3)] hover:shadow-[0_15px_30px_rgba(93,64,55,0.4)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : "Commencer l'Aventure"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[#8d6e63] font-serif">
              Pas encore de laissez-passer ?{' '}
              <Link 
                href="/auth/register" 
                className="block md:inline-block font-bold text-[#c7a667] hover:text-[#5d4037] underline decoration-dotted underline-offset-4"
              >
                Inscrivez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Play, Flame, Star, Clock, Sparkles, Shield, Lock, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieHeroProps {
  movie: Movie;
  allMovies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export default function MovieHero({ movie, allMovies, onPlayMovie, onSelectMovie }: MovieHeroProps) {
  return (
    <div id="movie-hero-section" className="relative min-h-[90vh] bg-[#050505] text-white">
      {/* Cinematic Banner Background */}
      <div id="hero-banner" className="absolute inset-0 h-[65vh] lg:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/40 z-10" />
        <img
          src={movie.bannerUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-65 transform scale-102 animate-fade-in transition-all duration-1000"
        />
      </div>

      {/* Main Details Overlay Grid */}
      <div id="hero-details-container" className="relative z-20 mx-auto max-w-7xl px-4 pt-[20vh] pb-12 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        
        {/* Left Side: Metadata and Actions */}
        <div id="movie-info" className="lg:col-span-8 space-y-6">
          {/* Tagline or Promo Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center space-x-1.5 rounded-full bg-white/5 border border-white/20 px-3 py-1 text-xs font-medium text-white/80 tracking-wide">
              <Flame className="h-3.5 w-3.5 text-zinc-300 fill-zinc-300" />
              <span>Trending #1 Today</span>
            </span>
            {movie.isPremium && (
              <span className="flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                <Lock className="h-3 w-3 mr-1 text-amber-300" />
                Prestige Release
              </span>
            )}
            <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-400 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
              {movie.matchScore}% Curated Match
            </span>
          </div>

          {/* Title - Beautiful High-end Serif Italic Display */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-bold tracking-tight text-white drop-shadow-md">
            {movie.title}
          </h1>

          {/* Subheading / Tagline */}
          <p className="text-lg lg:text-xl text-zinc-300 italic max-w-2xl font-light">
            "{movie.tagline}"
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-zinc-400 font-medium">
            <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] text-white">
              {movie.rating}
            </span>
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-zinc-500" />
              {movie.duration}
            </span>
            <span>{movie.year}</span>
            <span>{movie.category}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl font-light">
            {movie.description}
          </p>

          {/* Interactive Play Button Area - High Contrast Pure White Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              id="main-play-button"
              onClick={() => onPlayMovie(movie)}
              className="group flex items-center justify-center space-x-3 rounded-none bg-white text-black px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-black text-black group-hover:scale-110 transition-transform" />
              <span>Watch Now</span>
            </button>
            
            {movie.isPremium && (
              <div className="flex items-center space-x-2 text-xs text-amber-300/90 bg-amber-500/5 border border-amber-500/10 rounded-none px-4 py-3.5">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Frictionless access enabled:</strong> Guest accounts are provisioned instantly!
                </span>
              </div>
            )}
          </div>

          {/* Cast Details */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1 uppercase tracking-wider font-semibold">Starring</span>
              <span className="text-zinc-300 font-medium">{movie.cast.join(', ')}</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1 uppercase tracking-wider font-semibold">Director</span>
              <span className="text-zinc-300 font-medium">{movie.director}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Poster Card */}
        <div id="movie-poster-card" className="hidden lg:block lg:col-span-4 pl-8">
          <div className="relative group overflow-hidden rounded-none border border-white/10 bg-black/50 p-2 shadow-2xl backdrop-blur-sm transform transition duration-300 hover:scale-[1.01] hover:border-white/20">
            <div className="aspect-[2/3] overflow-hidden bg-neutral-900">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended/More Like This Carousel Rail */}
      <div id="recommendations-container" className="relative z-20 mx-auto max-w-7xl px-4 py-8 lg:px-8 border-t border-white/10">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-6 font-semibold flex items-center">
          <Film className="h-4 w-4 mr-2 text-zinc-400" />
          Selected Masterpieces
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allMovies.map((m) => {
            const isCurrent = m.id === movie.id;
            return (
              <div
                key={m.id}
                id={`movie-card-${m.id}`}
                onClick={() => onSelectMovie(m)}
                className={`group cursor-pointer rounded-none bg-zinc-950 border p-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  isCurrent 
                    ? 'border-white bg-[#121212] shadow-xl' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 mb-2">
                  <img
                    src={m.bannerUrl}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  {m.isPremium && (
                    <div className="absolute top-2 right-2 bg-black/80 border border-white/20 text-white rounded-none px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider flex items-center">
                      <Lock className="h-2 w-2 mr-0.5 text-amber-400" />
                      Prestige
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] text-white font-semibold uppercase tracking-widest flex items-center">
                      <Play className="h-2.5 w-2.5 fill-white mr-1 text-white" />
                      View Title
                    </span>
                  </div>
                </div>
                
                <div className="px-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-200 truncate group-hover:text-white">
                      {m.title}
                    </h4>
                    <span className="text-[10px] text-gray-500">{m.year}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-wider">{m.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

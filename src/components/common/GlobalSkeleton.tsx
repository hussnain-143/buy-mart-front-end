import React from 'react';

const GlobalSkeleton = () => {
    return (
        <div className="w-full min-h-[60vh] flex flex-col bg-transparent animate-in fade-in duration-1000">
            {/* Main Content Skeleton - Universal Single Column */}
            <main className="flex-grow mx-auto w-full max-w-7xl px-8 py-10 space-y-12">

                {/* Topic/Hero Banner Section - High Impact V3 */}
                <div className="w-full h-56 md:h-72 bg-gray-900 rounded-[3rem] animate-pulse flex flex-col justify-end p-10 relative overflow-hidden border border-white/[0.03] shadow-2xl">
                    {/* V3 Glow Sweep Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />

                    {/* Technical Geometric Accents */}
                    <div className="absolute top-10 right-10 flex gap-2">
                        <div className="h-6 w-6 rounded-lg bg-white/5 border border-white/5" />
                        <div className="h-6 w-12 rounded-lg bg-white/5 border border-white/5" />
                    </div>

                    {/* V3 Spark Dot */}
                    <div className="absolute top-12 left-12 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-pulse" />

                    <div className="space-y-6 relative z-10">
                        <div className="h-12 w-2/5 bg-white/10 rounded-2xl" />
                        <div className="h-6 w-3/5 bg-white/5 rounded-full" />
                    </div>
                </div>

                {/* Generic Content Sections */}
                <div className="space-y-16">

                    {/* Section 1: V3 Content Block */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-64 bg-gray-100 rounded-2xl animate-pulse" />
                            <div className="h-12 w-40 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
                        </div>
                        <div className="w-full bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10 space-y-6 relative overflow-hidden group">
                            {/* V3 Active Selection Bar */}
                            <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-orange-500 rounded-r-full shadow-[0_0_20px_rgba(249,115,22,0.5)]" />

                            <div className="h-6 w-3/4 bg-gray-100 rounded-xl animate-pulse" />
                            <div className="h-6 w-full bg-gray-50 rounded-xl animate-pulse" />
                            <div className="h-6 w-5/6 bg-gray-50 rounded-xl animate-pulse" />

                            <div className="mt-8 flex gap-5 pt-4">
                                <div className="h-12 w-36 bg-gray-900 rounded-2xl animate-pulse shadow-lg" />
                                <div className="h-12 w-36 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: V3 Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-[2.5rem] bg-white animate-pulse border border-white shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                                {/* Image area with V3 Depth Gradient */}
                                <div className="h-3/5 w-full bg-gradient-to-tr from-gray-50/50 to-gray-100/50 relative">
                                    {/* Tech Badge Accent */}
                                    <div className="absolute top-6 left-6 h-8 w-24 bg-gray-100 border border-white/50 rounded-xl shadow-sm" />

                                    {/* Center Abstract Shape */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-20 w-20 bg-white shadow-xl rounded-[2rem] flex items-center justify-center transform rotate-12 scale-90 border border-gray-50">
                                            <div className="h-10 w-10 bg-gray-50 rounded-xl" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content area - V3 Refinement */}
                                <div className="absolute bottom-0 left-0 right-0 h-2/5 p-8 space-y-4 bg-white/80">
                                    <div className="h-6 w-11/12 bg-gray-100 rounded-xl" />
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="h-7 w-2/5 bg-orange-500/10 rounded-lg" />
                                        <div className="h-10 w-10 bg-gray-50 rounded-2xl border border-gray-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GlobalSkeleton;

import React from 'react';

const GlobalSkeleton = () => {
    return (
        <div className="w-full min-h-[60vh] flex flex-col bg-transparent">

            {/* Main Content Skeleton - Universal Single Column */}
            <main className="flex-grow mx-auto w-full max-w-7xl px-6 py-8 space-y-12">

                {/* Topic/Hero Banner Section - High Impact */}
                <div className="w-full h-48 md:h-64 bg-secondary/5 rounded-3xl animate-pulse flex flex-col justify-end p-8 relative overflow-hidden border border-secondary/5 ring-1 ring-primary/10">
                    {/* Shimmer Effect with Brighter Accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />

                    {/* Decoration Circle - Brighter */}
                    <div className="absolute top-[-30px] right-[-30px] h-48 w-48 bg-primary/10 rounded-full blur-3xl opacity-60" />

                    <div className="space-y-5 relative z-10">
                        <div className="h-10 w-1/3 bg-secondary/20 rounded-lg animate-pulse" />
                        <div className="h-5 w-1/2 bg-accent/30 rounded-full animate-pulse shadow-sm" />
                    </div>
                </div>

                {/* Generic Content Sections */}
                <div className="space-y-16">

                    {/* Section 1: Title + Standard Block */}
                    <div className="space-y-8 ">
                        <div className="flex items-center justify-between">
                            <div className="h-8 w-56 bg-secondary/20 rounded-lg animate-pulse" />
                            <div className="h-10 w-32 bg-primary/20 rounded-xl animate-pulse shadow-sm" />
                        </div>
                        <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-md p-8 space-y-5 relative overflow-hidden group">
                            {/* Active Highlight Bar */}
                            <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-accent rounded-r-lg shadow-[0_0_10px_rgba(255,213,79,0.5)]" />

                            <div className="h-5 w-3/4 bg-secondary/10 rounded animate-pulse" />
                            <div className="h-5 w-full bg-secondary/10 rounded animate-pulse" />
                            <div className="h-5 w-5/6 bg-secondary/10 rounded animate-pulse" />

                            <div className="mt-6 flex gap-4 pt-2">
                                <div className="h-10 w-32 bg-primary/15 rounded-xl animate-pulse" />
                                <div className="h-10 w-32 bg-white border-2 border-secondary/10 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Cards Row - Maximum Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[3/2] rounded-2xl bg-white animate-pulse border border-gray-200 shadow-md relative overflow-hidden group">
                                {/* Image area with Gradient */}
                                <div className="h-2/3 w-full bg-gradient-to-tr from-secondary/5 to-secondary/10 relative">
                                    {/* Accent Badge - Popping Color */}
                                    <div className="absolute top-4 left-4 h-6 w-20 bg-accent rounded-full shadow-lg opacity-90" />

                                    {/* Center Icon Highlight */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-14 w-14 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                                            <div className="h-8 w-8 bg-primary/20 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content area - Stronger contrasts */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 p-5 space-y-3 bg-white">
                                    <div className="h-5 w-4/5 bg-secondary/20 rounded" />
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="h-5 w-1/3 bg-primary/25 rounded" />
                                        <div className="h-8 w-8 bg-secondary/10 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section 3: Text Content Area */}
                    <div className="max-w-4xl mx-auto space-y-5 p-8 bg-gradient-to-b from-white to-secondary/5 rounded-3xl border border-secondary/10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-4 rounded-full animate-pulse ${i % 2 === 0 ? 'bg-primary/10 w-full' : 'bg-secondary/15 w-3/4'}`} />
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default GlobalSkeleton;

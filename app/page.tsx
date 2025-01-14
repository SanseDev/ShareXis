export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold tracking-tight">Share<span className="text-[#4d7cfe]">xis</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-[#1a1d24] hover:bg-[#232730] transition-colors">
              <svg className="w-5 h-5 text-[#ffd43b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button className="bg-[#4d7cfe] hover:bg-[#3d6df0] px-5 py-2 rounded-lg transition-colors font-medium">
              Connexion
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-73px)] flex items-center">
        <div className="grid md:grid-cols-2 gap-20 items-center py-24">
          <div className="max-w-xl">
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 leading-[1.1]">
              Le partage de fichiers
              <span className="block text-[#4d7cfe]">simple et sécurisé</span>
            </h2>
            <p className="text-[#8b95a5] text-xl mb-12 leading-relaxed">
              Partagez, collaborez et gérez vos documents en toute sécurité.
              Une solution professionnelle adaptée à vos besoins.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#4d7cfe] hover:bg-[#3d6df0] px-8 py-4 rounded-xl transition-colors text-lg font-medium">
                Commencer gratuitement
              </button>
              <button className="bg-[#1a1d24] hover:bg-[#232730] border border-[#232730] px-8 py-4 rounded-xl transition-colors text-lg">
                Voir la démo
              </button>
            </div>
          </div>

          {/* Interface Preview */}
          <div className="relative bg-[#1a1d24] rounded-[28px] p-8 shadow-2xl shadow-black/20">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-lg shadow-[#ff5f57]/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-lg shadow-[#febc2e]/20"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-lg shadow-[#28c840]/20"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-6 bg-[#232730] rounded-md"></div>
                <div className="w-8 h-8 bg-[#232730] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#ffd43b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-[#232730] p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="text-[#8b95a5]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1 h-5 bg-[#1a1d24] rounded-lg"></div>
                <div className="w-10 h-10 bg-[#4d7cfe] hover:bg-[#3d6df0] rounded-lg flex items-center justify-center text-2xl transition-colors cursor-pointer">+</div>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-4">
              {/* Fichier */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2b3241] rounded-xl flex items-center justify-center group-hover:bg-[#303744] transition-colors">
                    <svg className="w-5 h-5 text-[#8b95a5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#1a1d24] rounded-lg w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#1a1d24] rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Dossier */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2b1d3c] rounded-xl flex items-center justify-center group-hover:bg-[#32234a] transition-colors">
                    <svg className="w-5 h-5 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#1a1d24] rounded-lg w-2/3 mb-2"></div>
                    <div className="h-3 bg-[#1a1d24] rounded-lg w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1d3c2b] rounded-xl flex items-center justify-center group-hover:bg-[#234a32] transition-colors">
                    <svg className="w-5 h-5 text-[#6ee7b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#1a1d24] rounded-lg w-5/6 mb-2"></div>
                    <div className="h-3 bg-[#1a1d24] rounded-lg w-1/4"></div>
                  </div>
                </div>
              </div>

              {/* Upload en cours */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1d2d3c] rounded-xl flex items-center justify-center group-hover:bg-[#23374a] transition-colors">
                    <svg className="w-5 h-5 text-[#4d7cfe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#1a1d24] rounded-lg w-4/5 mb-2"></div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="h-1.5 bg-[#4d7cfe]/10 rounded-full w-full">
                          <div className="absolute top-0 left-0 h-1.5 bg-[#4d7cfe] rounded-full w-[84%] transition-all duration-300"></div>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#4d7cfe] min-w-[32px]">84%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

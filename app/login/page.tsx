export default function Login() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">
      <div className="bg-[#1a1d24] p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Connexion</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-[#232730] border border-gray-800 focus:outline-none focus:border-[#4d7cfe]"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#232730] border border-gray-800 focus:outline-none focus:border-[#4d7cfe]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#4d7cfe] hover:bg-[#3d6df0] px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
} 
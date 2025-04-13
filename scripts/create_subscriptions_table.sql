-- Création de la table subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Création des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);

-- Ajout de politiques de sécurité RLS (Row Level Security)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir uniquement leurs propres abonnements
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres abonnements
CREATE POLICY "Users can create their own subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres abonnements
CREATE POLICY "Users can update their own subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres abonnements
CREATE POLICY "Users can delete their own subscriptions" 
  ON public.subscriptions 
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Politique pour permettre au service d'administration de voir tous les abonnements
CREATE POLICY "Admin can view all subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.role() = 'service_role');

-- Politique pour permettre au service d'administration de créer des abonnements pour n'importe quel utilisateur
CREATE POLICY "Admin can create subscriptions for any user" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Politique pour permettre au service d'administration de mettre à jour n'importe quel abonnement
CREATE POLICY "Admin can update any subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

-- Politique pour permettre au service d'administration de supprimer n'importe quel abonnement
CREATE POLICY "Admin can delete any subscription" 
  ON public.subscriptions 
  FOR DELETE 
  USING (auth.role() = 'service_role'); 
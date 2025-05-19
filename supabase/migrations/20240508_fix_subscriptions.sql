-- Supprimer les doublons en gardant l'entrée la plus récente
DELETE FROM subscriptions a 
USING subscriptions b 
WHERE a.created_at < b.created_at 
AND a.user_id = b.user_id;

-- Ajouter une contrainte d'unicité sur user_id
ALTER TABLE subscriptions
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Ajouter un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id); 
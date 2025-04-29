-- Insérer un abonnement pro pour un ID d'appareil
INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    created_at,
    expires_at
)
VALUES (
    'VOTRE_DEVICE_ID', -- Remplacez par votre device_id
    'pro',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1 month'
); 
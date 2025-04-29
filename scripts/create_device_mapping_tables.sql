-- Création de la table de mapping entre appareils et utilisateurs Google
CREATE TABLE IF NOT EXISTS public.device_user_mapping (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_id TEXT NOT NULL,
    google_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(device_id, google_id)
);

-- Création de la table des appareils autorisés
CREATE TABLE IF NOT EXISTS public.authorized_devices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subscription_id UUID REFERENCES subscriptions(id),
    device_id TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(subscription_id, device_id)
);

-- Création des index
CREATE INDEX IF NOT EXISTS idx_device_user_mapping_device_id ON public.device_user_mapping(device_id);
CREATE INDEX IF NOT EXISTS idx_device_user_mapping_google_id ON public.device_user_mapping(google_id);
CREATE INDEX IF NOT EXISTS idx_authorized_devices_device_id ON public.authorized_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_authorized_devices_subscription_id ON public.authorized_devices(subscription_id);

-- Ajout des politiques de sécurité RLS
ALTER TABLE public.device_user_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_devices ENABLE ROW LEVEL SECURITY;

-- Politiques pour device_user_mapping
CREATE POLICY "Users can view their own device mappings"
    ON public.device_user_mapping
    FOR SELECT
    USING (auth.uid()::text = google_id);

CREATE POLICY "Users can create their own device mappings"
    ON public.device_user_mapping
    FOR INSERT
    WITH CHECK (auth.uid()::text = google_id);

CREATE POLICY "Users can update their own device mappings"
    ON public.device_user_mapping
    FOR UPDATE
    USING (auth.uid()::text = google_id);

CREATE POLICY "Users can delete their own device mappings"
    ON public.device_user_mapping
    FOR DELETE
    USING (auth.uid()::text = google_id);

-- Politiques pour authorized_devices
CREATE POLICY "Users can view their authorized devices"
    ON public.authorized_devices
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.id = authorized_devices.subscription_id
        AND s.user_id = auth.uid()::text
    ));

CREATE POLICY "Users can manage their authorized devices"
    ON public.authorized_devices
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.id = authorized_devices.subscription_id
        AND s.user_id = auth.uid()::text
    )); 
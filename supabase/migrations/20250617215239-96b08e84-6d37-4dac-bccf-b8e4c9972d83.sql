
-- Créer les profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des appareils/ordinateurs
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'laptop', 'server', 'mobile')),
  operating_system TEXT,
  ip_address INET,
  mac_address TEXT,
  access_code TEXT UNIQUE,
  is_permanent BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE,
  agent_installed BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des sessions de contrôle à distance
CREATE TABLE public.remote_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_device_id UUID NOT NULL REFERENCES public.devices ON DELETE CASCADE,
  controller_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('assistance', 'work', 'personal')),
  access_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'rejected')),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  chat_enabled BOOLEAN DEFAULT TRUE,
  file_transfer_enabled BOOLEAN DEFAULT TRUE,
  screen_sharing_quality TEXT DEFAULT 'medium' CHECK (screen_sharing_quality IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table de l'historique des connexions
CREATE TABLE public.connection_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.remote_sessions ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('connect', 'disconnect', 'login', 'logout', 'file_transfer', 'chat_message')),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  suspicious_activity BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des transferts de fichiers
CREATE TABLE public.file_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.remote_sessions ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  receiver_device_id UUID REFERENCES public.devices ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  file_path TEXT,
  transfer_direction TEXT NOT NULL CHECK (transfer_direction IN ('upload', 'download')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  transfer_speed BIGINT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des autorisations d'accès multi-utilisateur
CREATE TABLE public.device_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.devices ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('owner', 'full_control', 'view_only', 'file_transfer_only')),
  granted_by UUID REFERENCES auth.users ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(device_id, user_id)
);

-- Créer la table des messages de chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.remote_sessions ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  is_moderated BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques RLS pour devices
CREATE POLICY "Users can view their own devices" ON public.devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own devices" ON public.devices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view devices they have permission to access" ON public.devices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.device_permissions 
      WHERE device_id = devices.id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- Politiques RLS pour remote_sessions
CREATE POLICY "Users can view sessions they control or host" ON public.remote_sessions
  FOR SELECT USING (
    auth.uid() = controller_user_id OR 
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = remote_sessions.host_device_id 
      AND devices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sessions for devices they can access" ON public.remote_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = host_device_id 
      AND (devices.user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM public.device_permissions 
             WHERE device_id = devices.id 
             AND user_id = auth.uid() 
             AND is_active = true
           ))
    )
  );

-- Politiques RLS pour connection_history
CREATE POLICY "Users can view their own connection history" ON public.connection_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connection history" ON public.connection_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour file_transfers
CREATE POLICY "Users can view their file transfers" ON public.file_transfers
  FOR SELECT USING (auth.uid() = sender_user_id);

CREATE POLICY "Users can create file transfers" ON public.file_transfers
  FOR INSERT WITH CHECK (auth.uid() = sender_user_id);

-- Politiques RLS pour device_permissions
CREATE POLICY "Device owners can manage permissions" ON public.device_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = device_permissions.device_id 
      AND devices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own permissions" ON public.device_permissions
  FOR SELECT USING (auth.uid() = user_id);

-- Politiques RLS pour chat_messages
CREATE POLICY "Users can view chat messages from their sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.remote_sessions 
      WHERE remote_sessions.id = chat_messages.session_id 
      AND (remote_sessions.controller_user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM public.devices 
             WHERE devices.id = remote_sessions.host_device_id 
             AND devices.user_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Users can send chat messages in their sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_user_id);

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Créer un trigger pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

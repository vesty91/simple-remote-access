/*
  # Migration pour Restor-PC - Système de contrôle à distance

  1. Nouvelles Tables
    - `profiles` - Profils utilisateurs étendus
    - `devices` - Appareils/ordinateurs gérés
    - `remote_sessions` - Sessions de contrôle à distance
    - `connection_history` - Historique des connexions
    - `file_transfers` - Transferts de fichiers
    - `device_permissions` - Permissions d'accès multi-utilisateur
    - `chat_messages` - Messages de chat en temps réel

  2. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès basées sur l'authentification
    - Contrôle des permissions par utilisateur

  3. Fonctionnalités
    - Gestion des appareils avec codes d'accès
    - Sessions de contrôle à distance sécurisées
    - Transfert de fichiers avec suivi de progression
    - Chat intégré aux sessions
    - Historique complet des activités
*/

-- Créer les profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les contraintes et références si elles n'existent pas
DO $$
BEGIN
  -- Ajouter la contrainte de clé étrangère pour profiles.id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Ajouter la contrainte de vérification pour le rôle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_role_check' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'user', 'moderator'));
  END IF;
END $$;

-- Créer la table des appareils/ordinateurs
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL,
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

-- Ajouter les contraintes pour devices
DO $$
BEGIN
  -- Contrainte de clé étrangère pour user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'devices_user_id_fkey' AND table_name = 'devices'
  ) THEN
    ALTER TABLE public.devices ADD CONSTRAINT devices_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte de vérification pour device_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'devices_device_type_check' AND table_name = 'devices'
  ) THEN
    ALTER TABLE public.devices ADD CONSTRAINT devices_device_type_check 
    CHECK (device_type IN ('desktop', 'laptop', 'server', 'mobile'));
  END IF;
END $$;

-- Créer la table des sessions de contrôle à distance
CREATE TABLE IF NOT EXISTS public.remote_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_device_id UUID NOT NULL,
  controller_user_id UUID NOT NULL,
  session_type TEXT NOT NULL,
  access_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  chat_enabled BOOLEAN DEFAULT TRUE,
  file_transfer_enabled BOOLEAN DEFAULT TRUE,
  screen_sharing_quality TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les contraintes pour remote_sessions
DO $$
BEGIN
  -- Contrainte de clé étrangère pour host_device_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'remote_sessions_host_device_id_fkey' AND table_name = 'remote_sessions'
  ) THEN
    ALTER TABLE public.remote_sessions ADD CONSTRAINT remote_sessions_host_device_id_fkey 
    FOREIGN KEY (host_device_id) REFERENCES public.devices(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte de clé étrangère pour controller_user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'remote_sessions_controller_user_id_fkey' AND table_name = 'remote_sessions'
  ) THEN
    ALTER TABLE public.remote_sessions ADD CONSTRAINT remote_sessions_controller_user_id_fkey 
    FOREIGN KEY (controller_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contraintes de vérification
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'remote_sessions_session_type_check' AND table_name = 'remote_sessions'
  ) THEN
    ALTER TABLE public.remote_sessions ADD CONSTRAINT remote_sessions_session_type_check 
    CHECK (session_type IN ('assistance', 'work', 'personal'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'remote_sessions_status_check' AND table_name = 'remote_sessions'
  ) THEN
    ALTER TABLE public.remote_sessions ADD CONSTRAINT remote_sessions_status_check 
    CHECK (status IN ('pending', 'active', 'ended', 'rejected'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'remote_sessions_screen_sharing_quality_check' AND table_name = 'remote_sessions'
  ) THEN
    ALTER TABLE public.remote_sessions ADD CONSTRAINT remote_sessions_screen_sharing_quality_check 
    CHECK (screen_sharing_quality IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Créer la table de l'historique des connexions
CREATE TABLE IF NOT EXISTS public.connection_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID,
  user_id UUID NOT NULL,
  device_id UUID,
  action_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  suspicious_activity BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les contraintes pour connection_history
DO $$
BEGIN
  -- Contraintes de clé étrangère
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'connection_history_session_id_fkey' AND table_name = 'connection_history'
  ) THEN
    ALTER TABLE public.connection_history ADD CONSTRAINT connection_history_session_id_fkey 
    FOREIGN KEY (session_id) REFERENCES public.remote_sessions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'connection_history_user_id_fkey' AND table_name = 'connection_history'
  ) THEN
    ALTER TABLE public.connection_history ADD CONSTRAINT connection_history_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'connection_history_device_id_fkey' AND table_name = 'connection_history'
  ) THEN
    ALTER TABLE public.connection_history ADD CONSTRAINT connection_history_device_id_fkey 
    FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE SET NULL;
  END IF;

  -- Contrainte de vérification pour action_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'connection_history_action_type_check' AND table_name = 'connection_history'
  ) THEN
    ALTER TABLE public.connection_history ADD CONSTRAINT connection_history_action_type_check 
    CHECK (action_type IN ('connect', 'disconnect', 'login', 'logout', 'file_transfer', 'chat_message'));
  END IF;
END $$;

-- Créer la table des transferts de fichiers
CREATE TABLE IF NOT EXISTS public.file_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  sender_user_id UUID NOT NULL,
  receiver_device_id UUID,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  file_path TEXT,
  transfer_direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0,
  transfer_speed BIGINT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les contraintes pour file_transfers
DO $$
BEGIN
  -- Contraintes de clé étrangère
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_session_id_fkey' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_session_id_fkey 
    FOREIGN KEY (session_id) REFERENCES public.remote_sessions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_sender_user_id_fkey' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_sender_user_id_fkey 
    FOREIGN KEY (sender_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_receiver_device_id_fkey' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_receiver_device_id_fkey 
    FOREIGN KEY (receiver_device_id) REFERENCES public.devices(id) ON DELETE SET NULL;
  END IF;

  -- Contraintes de vérification
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_transfer_direction_check' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_transfer_direction_check 
    CHECK (transfer_direction IN ('upload', 'download'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_status_check' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_status_check 
    CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'file_transfers_progress_percentage_check' AND table_name = 'file_transfers'
  ) THEN
    ALTER TABLE public.file_transfers ADD CONSTRAINT file_transfers_progress_percentage_check 
    CHECK (progress_percentage >= 0 AND progress_percentage <= 100);
  END IF;
END $$;

-- Créer la table des autorisations d'accès multi-utilisateur
CREATE TABLE IF NOT EXISTS public.device_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL,
  user_id UUID NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view_only',
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Ajouter les contraintes pour device_permissions
DO $$
BEGIN
  -- Contraintes de clé étrangère
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'device_permissions_device_id_fkey' AND table_name = 'device_permissions'
  ) THEN
    ALTER TABLE public.device_permissions ADD CONSTRAINT device_permissions_device_id_fkey 
    FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'device_permissions_user_id_fkey' AND table_name = 'device_permissions'
  ) THEN
    ALTER TABLE public.device_permissions ADD CONSTRAINT device_permissions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'device_permissions_granted_by_fkey' AND table_name = 'device_permissions'
  ) THEN
    ALTER TABLE public.device_permissions ADD CONSTRAINT device_permissions_granted_by_fkey 
    FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Contrainte unique
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'device_permissions_device_id_user_id_key' AND table_name = 'device_permissions'
  ) THEN
    ALTER TABLE public.device_permissions ADD CONSTRAINT device_permissions_device_id_user_id_key 
    UNIQUE(device_id, user_id);
  END IF;

  -- Contrainte de vérification pour permission_level
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'device_permissions_permission_level_check' AND table_name = 'device_permissions'
  ) THEN
    ALTER TABLE public.device_permissions ADD CONSTRAINT device_permissions_permission_level_check 
    CHECK (permission_level IN ('owner', 'full_control', 'view_only', 'file_transfer_only'));
  END IF;
END $$;

-- Créer la table des messages de chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  sender_user_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_moderated BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les contraintes pour chat_messages
DO $$
BEGIN
  -- Contraintes de clé étrangère
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'chat_messages_session_id_fkey' AND table_name = 'chat_messages'
  ) THEN
    ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_session_id_fkey 
    FOREIGN KEY (session_id) REFERENCES public.remote_sessions(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'chat_messages_sender_user_id_fkey' AND table_name = 'chat_messages'
  ) THEN
    ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_sender_user_id_fkey 
    FOREIGN KEY (sender_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte de vérification pour message_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'chat_messages_message_type_check' AND table_name = 'chat_messages'
  ) THEN
    ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_message_type_check 
    CHECK (message_type IN ('text', 'file', 'system'));
  END IF;
END $$;

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques RLS pour devices
DROP POLICY IF EXISTS "Users can view their own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can manage their own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can view devices they have permission to access" ON public.devices;

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
DROP POLICY IF EXISTS "Users can view sessions they control or host" ON public.remote_sessions;
DROP POLICY IF EXISTS "Users can create sessions for devices they can access" ON public.remote_sessions;

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
DROP POLICY IF EXISTS "Users can view their own connection history" ON public.connection_history;
DROP POLICY IF EXISTS "Users can insert their own connection history" ON public.connection_history;

CREATE POLICY "Users can view their own connection history" ON public.connection_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connection history" ON public.connection_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour file_transfers
DROP POLICY IF EXISTS "Users can view their file transfers" ON public.file_transfers;
DROP POLICY IF EXISTS "Users can create file transfers" ON public.file_transfers;

CREATE POLICY "Users can view their file transfers" ON public.file_transfers
  FOR SELECT USING (auth.uid() = sender_user_id);

CREATE POLICY "Users can create file transfers" ON public.file_transfers
  FOR INSERT WITH CHECK (auth.uid() = sender_user_id);

-- Politiques RLS pour device_permissions
DROP POLICY IF EXISTS "Device owners can manage permissions" ON public.device_permissions;
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.device_permissions;

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
DROP POLICY IF EXISTS "Users can view chat messages from their sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send chat messages in their sessions" ON public.chat_messages;

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

-- Créer ou remplacer la fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les triggers existants s'ils existent et les recréer
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_devices_updated_at ON public.devices;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Créer ou remplacer la fonction pour créer automatiquement un profil utilisateur lors de l'inscription
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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger existant s'il existe et le recréer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
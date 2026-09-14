-- Crea la funzione nello schema privato (non esposta all'API Data)
CREATE OR REPLACE FUNCTION private.protect_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Gli amministratori possono modificare qualsiasi campo
  IF private.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Gli utenti normali non possono alterare campi di sistema o identità
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.membership_status IS DISTINCT FROM OLD.membership_status
     OR NEW.member_id IS DISTINCT FROM OLD.member_id
     OR NEW.qr_token IS DISTINCT FROM OLD.qr_token
     OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
     OR NEW.referred_by IS DISTINCT FROM OLD.referred_by
     OR NEW.member_since IS DISTINCT FROM OLD.member_since THEN
    RAISE EXCEPTION 'Non hai i permessi per modificare campi di sistema del profilo';
  END IF;

  RETURN NEW;
END;
$$;

-- Aggiorna il trigger per usare la funzione privata
DROP TRIGGER IF EXISTS profiles_protect_system_fields ON public.profiles;
CREATE TRIGGER profiles_protect_system_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION private.protect_profile_fields();

-- Rimuove la vecchia funzione pubblica
DROP FUNCTION IF EXISTS public.protect_profile_fields();
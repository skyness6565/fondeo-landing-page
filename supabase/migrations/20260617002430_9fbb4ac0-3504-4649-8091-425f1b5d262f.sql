CREATE UNIQUE INDEX IF NOT EXISTS profiles_eth_address_unique ON public.profiles (lower(eth_address)) WHERE eth_address IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_eth text := NEW.raw_user_meta_data->>'eth_address';
BEGIN
  IF v_eth IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles WHERE lower(eth_address) = lower(v_eth)
  ) THEN
    RAISE EXCEPTION 'ETH address already registered' USING ERRCODE = '23505';
  END IF;
  INSERT INTO public.profiles (id, full_name, eth_address)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), v_eth);
  INSERT INTO public.accounts (user_id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
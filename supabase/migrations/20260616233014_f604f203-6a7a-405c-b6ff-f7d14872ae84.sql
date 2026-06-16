
-- Admin: view all profiles
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin: view & update all accounts
CREATE POLICY "Admins view all accounts" ON public.accounts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all accounts" ON public.accounts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin: manage investment plans
CREATE POLICY "Admins insert plans" ON public.investment_plans
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update plans" ON public.investment_plans
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete plans" ON public.investment_plans
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin: view & update investments
CREATE POLICY "Admins view all investments" ON public.investments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all investments" ON public.investments
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin: view & insert transactions for any user
CREATE POLICY "Admins view all transactions" ON public.transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert any transactions" ON public.transactions
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin: view & update withdrawals
CREATE POLICY "Admins view all withdrawals" ON public.withdrawals
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update withdrawals" ON public.withdrawals
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- View all user roles (admin)
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

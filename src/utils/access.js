export const accessTiers = [
  'Velvet Booth #07 (VIP)',
  'Private Mezzanine Suite',
  'Whiskey Cellar Table',
  'Main Bar Counter',
];

export function validateEntry({ username, password, tier }) {
  const errors = {};
  if (!username.trim()) errors.username = 'Isi nama Anda dulu, ya.';
  else if (username.length > 60) errors.username = 'Nama maksimal 60 karakter.';
  if (!password.trim()) errors.password = 'Passcode belum diisi.';
  else if (password.length < 4) errors.password = 'Gunakan minimal 4 karakter.';
  if (!accessTiers.includes(tier)) errors.tier = 'Pilih ruangan yang tersedia.';
  return errors;
}

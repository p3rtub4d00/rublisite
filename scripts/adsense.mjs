export function adsenseConfig(value = '') {
  const id = value.trim().replace(/^ca-/, '');
  if (!id) return { meta: '', adsTxt: '' };
  if (!/^pub-\d{16}$/.test(id)) throw new Error('ADSENSE_PUBLISHER_ID deve ser pub- seguido de 16 dígitos (ou ca-pub-).');
  return {
    meta: `<meta name="google-adsense-account" content="ca-${id}">`,
    adsTxt: `google.com, ${id}, DIRECT, f08c47fec0942fa0\n`
  };
}

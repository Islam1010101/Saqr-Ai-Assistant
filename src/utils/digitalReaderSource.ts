/** Only known Google Drive file URLs are embedded; folders keep their source link. */
export function digitalReaderSource(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com') return null;
    const match = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  } catch { return null; }
}

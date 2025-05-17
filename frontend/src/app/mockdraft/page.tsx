import MockDraft from '@/components/mock-draft/MockDraft';
import { Player } from '@/types';

export default async function MockDraftPage() {
  const res = await fetch('http://127.0.0.1:8000/players', {
    cache: 'no-store',
  });

  const json = await res.json();
  const initialPlayers: Player[] = Array.isArray(json) ? json : [];

  return <MockDraft initialPlayers={initialPlayers} />;
}
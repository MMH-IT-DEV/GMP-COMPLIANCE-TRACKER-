import { redirect } from 'next/navigation';
import { checklists } from '@/lib/checklist-data';

export default function Home() {
  // Redirect to the first checklist by default as the dashboard is removed
  redirect(`/checklist/${checklists[0].id}`);
  return null;
}

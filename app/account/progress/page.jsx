import { getProgressData } from '../sample-data';
import ProgressView from './ProgressView';

export const metadata = { title: 'Progress' };

export default async function ProgressPage() {
  const data = await getProgressData();
  return <ProgressView data={data} />;
}

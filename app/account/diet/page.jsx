import { getDietData } from '../sample-data';
import DietView from './DietView';

export const metadata = { title: 'Diet' };

export default async function DietPage() {
  const data = await getDietData();
  return <DietView data={data} />;
}

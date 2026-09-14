import { getSleepData } from '../sample-data';
import SleepView from './SleepView';

export const metadata = { title: 'Sleep' };

export default async function SleepPage() {
  const data = await getSleepData();
  return <SleepView data={data} />;
}

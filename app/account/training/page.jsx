import { getTrainingData } from './training-data';
import TrainingView from './TrainingView';

export const metadata = { title: 'Training' };

export default async function TrainingPage() {
  const data = await getTrainingData();
  return <TrainingView data={data} />;
}

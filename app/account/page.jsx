import { getHomeData } from './home-data';
import HomeView from './HomeView';

export const metadata = { title: 'Home' };

export default async function AccountHomePage() {
  const data = await getHomeData();
  return <HomeView data={data} />;
}

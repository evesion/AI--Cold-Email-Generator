import type { NextPage } from 'next';
import ColdEmailGenerator from '@/components/ColdEmailGenerator';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen p-4">
      <ColdEmailGenerator />
    </div>
  );
};

export default Home;

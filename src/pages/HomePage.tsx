import useAuthstore from '../stores/useAuthStore';

const HomePage = () => {
  console.log(useAuthstore.getState());
  return <div>홈페이지</div>;
};

export default HomePage;

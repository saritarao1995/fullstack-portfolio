import { useSelector } from 'react-redux';
import StoreFooter from '../components/layout/StoreFooter';
import { selectCompany } from '../store/selectors/settingsSelectors';

const StoreFooterContainer = () => {
  const company = useSelector(selectCompany);

  return (
    <StoreFooter
      name={company.shortName}
      description={company.description}
      address={company.address}
      phone={company.phone}
      email={company.email}
      hours={company.hours}
    />
  );
};

export default StoreFooterContainer;

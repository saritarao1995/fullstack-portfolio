import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCompany } from '../store/selectors/settingsSelectors';

const DocumentTitleContainer = () => {
  const company = useSelector(selectCompany);

  useEffect(() => {
    document.title = company.name || 'Showroom';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && company.description) meta.setAttribute('content', company.description);
  }, [company.name, company.description]);

  return null;
};

export default DocumentTitleContainer;

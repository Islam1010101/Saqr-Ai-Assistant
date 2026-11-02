import React from 'react';
import ArabicLibraryInternalPage from './ArabicLibraryInternalPage';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../api/nationalIdentityDigitalBooks';

/** Reuse the Arabic digital library's card, filters, modal, animations and reading features. */
const NationalIdentityDigitalBooksPage: React.FC = () => (
  <ArabicLibraryInternalPage
    books={NATIONAL_IDENTITY_DIGITAL_BOOKS}
    pageTitle={{ ar: 'كتب الهوية الوطنية', en: 'National Identity Books' }}
    atmosphere="heritage"
  />
);

export default NationalIdentityDigitalBooksPage;

import mock from './mock';
import './contacts/ContactsData';
import './eCommerce/ProductsData';
import './userprofile/PostData';
import './userprofile/UsersData';

mock.onAny().passThrough();

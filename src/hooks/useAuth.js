import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { selectCurrentToken } from '../Features/auth/authSlice';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode(token);
    console.log(decoded);
    const { full_name, role, email, user_id } = decoded?.userInfo;
    console.log({ full_name, role, email, user_id });
    return { full_name, role, email, user_id };
  }

  return { full_name: '', role: '', email: '', user_id: '' };
};
export default useAuth;

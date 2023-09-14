
import { Navigate } from "react-router-dom";
import { useAuth } from 'hooks/useAuth';
import { Roles } from 'types/Enums';

const ProtectedRoute = (args: any) => {
  const { user } = useAuth();

  const {children: el} = args;

  const children = el[1];
  console.log(user?.role);
  
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  if(!children.props.userRole ||  children.props.userRole.includes(user?.role) || user?.role === Roles.Lord){
    // check user role and access to page if its ok
    return children;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute

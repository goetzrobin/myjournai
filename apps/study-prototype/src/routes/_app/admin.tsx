import { createFileRoute, Outlet } from '@tanstack/react-router';
import { redirectWhenNotAdmin } from '~myjournai/user-client';
import { Link } from '~myjournai/components';


export const Route = createFileRoute('/_app/admin')({
  beforeLoad: async ({ context, location }) => await redirectWhenNotAdmin(location, context?.queryClient),
  component: AdminIndex
});

function AdminIndex() {
  return <>
  <ul className="flex space-x-1">
    <li><Link to="/admin/global-contexts">Global Contexts</Link></li>
    <li><Link to="/admin/local-contexts">Local Contexts</Link></li>
    <li><Link to="/admin/personal-contexts">Personal Contexts</Link></li>
  </ul>
  <Outlet/>
  </>
}

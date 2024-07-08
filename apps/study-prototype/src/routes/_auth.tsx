import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { authenticateRoute, useSignOutMutation } from '~myjournai/auth';

export const Route = createFileRoute('/_auth')({
  beforeLoad: authenticateRoute,
  component: AuthLayout
});

function AuthLayout() {
  const navigate = useNavigate();
  const signOutMut = useSignOutMutation(() => navigate({
    to: '/sign-in'
  }));
  return (
    <div className="h-full">
      <ul className="py-2 flex gap-2">
        <li>
          <Link
            to="/"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Invoices
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="hover:underline"
            onClick={() => signOutMut.mutate()}
          >
            Logout
          </button>
        </li>
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}

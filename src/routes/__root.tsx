import { Link, Outlet, createRootRoute } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <div class="p-2 flex gap-2 text-lg border-b">
        <Link
          to="/inbox"
          activeProps={{
            class: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Inbox
        </Link>{' '}
      </div>
      <hr />
      <Outlet />
    </>
  );
}

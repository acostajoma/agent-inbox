import { createFileRoute } from '@tanstack/solid-router';
import { Link } from "@tanstack/solid-router";

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div class="p-2">
      <h3>Welcome to the Agent Inbox Trial!</h3>
      <Link to="/inbox" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400">Click to open the inbox</Link>
    </div>
  );
}

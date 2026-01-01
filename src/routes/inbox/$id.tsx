import { createFileRoute } from "@tanstack/solid-router";
import { createMemo, Show } from "solid-js";
import { getInboxState, setSelectedId, updateItemStatus, simulateAgentStream } from "../../stores/inboxStore";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";

export const Route = createFileRoute('/inbox/$id')({
  component: InboxDetail,
  loader: ({ params }) => {
    // Sync store selection with URL
    setSelectedId(params.id);
  }
});

function InboxDetail() {
  const params = Route.useParams();
  const state = getInboxState();

  const item = createMemo(() => state.items.find(i => i.id === params().id));

  const handleAction = (action: 'approve' | 'retry') => {
    const current = item();
    if (!current) return;

    if (action === 'approve') updateItemStatus(current.id, 'agent_resolved');
    if (action === 'retry') updateItemStatus(current.id, 'agent_working');
  };

  return (
    <Show when={item()} fallback={<div class="p-10 text-gray-400">Select an item</div>}>
      {(i) => (
        <div class="flex flex-col">
          {/* Header */}
          <header class="md:flex md:items-center md:justify-between p-6">
            <div class="min-w-0 flex-1">
              <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {i().subject}
              </h2>
            </div>
            <Show when={['needs_approval', 'needs_clarification'].includes(i().status)}>

              <div class="mt-4 flex md:mt-0 md:ml-4">
                <button
                  onClick={() => handleAction('retry')}

                  type="button"
                  class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                >
                  Request Changes

                </button>
                <button
                  onClick={() => handleAction('approve')}

                  type="button"
                  class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
                >
                  Approve & Resolve
                </button>
              </div>
            </Show>
          </header>

          {/* Details */}
          <div class="px-6 text-sm text-gray-500">
            <p class="mb-2"><span class="font-semibold">Requested by:</span> {i().requester.name} from {i().requester.team}</p>
            <span class="font-semibold mr-2">State:</span>
            <Badge label={i().status.replace('_', ' ')} priority={i().priority} />
          </div>

          {/* Content */}
          <div class="m-4 overflow-hidden rounded-lg bg-white shadow-sm">
            <div class="px-4 py-5 sm:p-6">
              <p class="text-gray-800">{i().summary}</p>
            </div>
          </div>
          


            {/* AGENT STREAM */}
            <div class="flex gap-4 m-4">
              <Avatar initials="AI" />
              <div class="flex-1">
                <div class="prose prose-sm max-w-none">
        
                  <p class="whitespace-pre-wrap text-gray-700 text-sm">{i().agent_response}</p>
                  <Show when={i().is_streaming}>
                    <span class="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1 align-middle" />
                  </Show>
                </div>
              </div>
            </div>

          {/* Action Footer */}
          <footer class="p-6 border-t flex gap-3 justify-end">

            {/* Restart Demo Button */}
            <Show when={!i().is_streaming && i().status === 'agent_resolved'}>
              <button onClick={() => simulateAgentStream(i().id)} class="text-xs text-gray-400 hover:text-blue-500">
                (Debug: Restart Stream)
              </button>
            </Show>
          </footer>
        </div>
      )}
    </Show>
  );
}
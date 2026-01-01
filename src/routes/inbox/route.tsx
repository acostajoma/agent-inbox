import { createMemo, createEffect, onCleanup, Show } from "solid-js";
import { Outlet, useNavigate, useParams, createFileRoute } from "@tanstack/solid-router";
import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { getInboxState, setSelectedId } from "../../stores/inboxStore";
import { InboxCard } from "../../components/InboxCard";
import { For } from "solid-js"

type HeaderItem = {
  id: string;
  type: 'header';
  label: string;
}

export const Route = createFileRoute('/inbox')({
  component: InboxLayout,
});

function InboxLayout() {
  const [parent, setEnabled] = createAutoAnimate()
  const state = getInboxState();
  const navigate = useNavigate();

  const aiHandling = createMemo(() => 
    state.items.filter(i => ['agent_working', 'agent_resolved'].includes(i.status))
  );

  const needsYou = createMemo(() => 
    state.items.filter(i => ['needs_clarification', 'needs_approval', 'agent_stuck'].includes(i.status))
  );

  const AI_HEADER: HeaderItem = { id: 'header-ai', type: 'header', label: 'AI Handling' };
  const NEEDS_HEADER: HeaderItem = { id: 'header-needs', type: 'header', label: 'Needs You' };

  const displayList = createMemo(() => {
    return [
      AI_HEADER,
      ...aiHandling(),
      NEEDS_HEADER,
      ...needsYou()
    ];
  });

  const allItems = createMemo(() => [...aiHandling(), ...needsYou()]);

  // Keyboard Navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;

    const items = allItems();
    if (items.length === 0) return;

    const currentIndex = items.findIndex(item => item.id === state.selectedId);

    switch (e.key) {
      case 'j': {
        const nextIndex = (currentIndex + 1) % items.length;
        setSelectedId(items[nextIndex].id);
        break;
      }
      case 'k': {
        const nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        setSelectedId(items[nextIndex].id);
        break;
      }
      case 'Enter': {
        if (state.selectedId) navigate({ to: `/inbox/${state.selectedId}` });
        break;
      }
    }
  };

  createEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      {/* LEFT PANEL */}
      <div class="w-1/3 min-w-[350px] border-r border-gray-200 flex flex-col">
        <header class="p-4 border-b bg-white">
          <h1 class="font-bold text-xl text-gray-900">Agent Inbox</h1>
        </header>
        
        <div class="flex-1 overflow-y-auto p-4">
          <div ref={parent} class="space-y-2">
            <For each={displayList()}>
              {(item) => {
                if ('type' in item && item.type === 'header') {
                  // Count as an accessor to trigger reactivity
                  const count = () => item.id === 'header-ai' ? aiHandling().length : needsYou().length;
                  const colorClass = item.id === 'header-ai' 
                    ? "bg-gray-200 text-gray-700" 
                    : "bg-amber-100 text-amber-700";
                    
                  return (
                    <Show when={count() > 0}>
                      <h2 class="text-xs font-bold text-gray-500 uppercase mt-6 first:mt-0 mb-3 flex items-center justify-between">
                        {item.label}
                        <span class={`px-2 py-0.5 rounded-full ${colorClass}`}>{count()}</span>
                      </h2>
                    </Show>
                  );
                }
                
                return (
                  <InboxCard 
                    item={item as any} 
                    isActive={state.selectedId === (item as any).id} 
                  />
                );
              }}
            </For>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <main class="flex-1 bg-white relative">
        <Outlet /> 
      </main>
    </div>
  );
}
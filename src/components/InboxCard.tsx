import { Component, Show } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { InboxItem, InboxStatus } from "../types";
import { Badge } from "./Badge";

interface Props {
    item: InboxItem;
    isActive: boolean;
}
const STATUS_BADGE_COLORS: Record<InboxStatus, string> = {
    agent_working: "border-blue-500 bg-blue-50",
    needs_approval: "border-amber-500 bg-amber-50",
    agent_stuck: "border-red-500 bg-red-50",
    agent_resolved: "border-green-500 bg-green-50",
    needs_clarification: "border-yellow-500 bg-yellow-50",
};
export const InboxCard: Component<Props> = (props) => {

    return (
        <Link
            to="/inbox/$id"
            params={{ id: props.item.id }}
            class={`divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm transition-all block border-l-4 hover:shadow-md ${props.isActive ? "ring-2 ring-indigo-500" : ""}`}
        >
            <div class="px-4 py-5 sm:px-6">
                <h3 class="font-bold text-gray-800">{props.item.requester.name}</h3>

            </div>
            <div class="px-4 py-5 sm:p-6">
                <p class="text-sm text-gray-900 my-1 truncate">{props.item.subject}</p>
                <div class="flex items-center gap-2 justify-between">
                    <Badge label={props.item.priority} priority={props.item.priority} showPriorityColor={true} />
                    <Show when={props.item.status === 'agent_working'}>
                        <div class="text-xs text-blue-600 justify-end items-center gap-1">
                            <span class="animate-pulse">● AI Processing...</span>
                        </div>
                    </Show>
                </div>
            </div>
        </Link>

    );
};
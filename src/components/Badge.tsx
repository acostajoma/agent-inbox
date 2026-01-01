import { Component, Show } from "solid-js";
import type { Priority } from "../types"

interface Props {
    label: string;
    priority: Priority;
    showPriorityColor?: boolean;
}
const BADGE_COLORS: Record<Priority, string> = {
    low: "fill-gray-500",
    medium: "fill-yellow-500",
    high: "fill-orange-400",
    urgent: "fill-red-500",
};

export const Badge: Component<Props> = (props) => {
    return (
        <span
            class="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-200"
        >
            <Show when={props.showPriorityColor}>
                <svg viewBox="0 0 6 6" aria-hidden="true" class={`size-1.5 ${BADGE_COLORS[props.priority]}`}>
                    <circle r={3} cx={3} cy={3} />
                </svg>
            </Show>
            {props.label.charAt(0).toUpperCase() + props.label.slice(1)}
        </span> 
    );
};

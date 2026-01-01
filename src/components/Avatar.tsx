import { Component } from "solid-js";

interface Props {
    initials: string;
}

export const Avatar: Component<Props> = (props) => {
  return (
      <div class="inline-flex size-8 items-center justify-center rounded-full bg-gray-500 outline -outline-offset-1 outline-black/5">
        <span class="text-sm font-medium text-white">{props.initials}</span>
      </div>

  )
}

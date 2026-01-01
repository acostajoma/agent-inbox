# Agent Inbox

Keyboard-centric inbox application built with **SolidJS** and **TanStack Router**. Designed for speed and efficient workflow management, distinguishing between AI-handled tasks and those requiring human intervention.

## 🚀 Setup Instructions

This project uses **Bun** (or local comparable package manager).

1.  **Install Dependencies**
    ```bash
    bun install
    # or
    npm install
    ```

2.  **Run Development Server**
    ```bash
    bun run dev
    # or
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

3.  **Build for Production**
    ```bash
    bun run build
    ```

## 🧠 Key Decisions & Tradeoffs

### 1. **Single Global Store (`inboxStore.ts`)**
*   **Decision:** Utilized a singleton `createStore` pattern rather than Context providers or distributed signals.
*   **Tradeoff:** While this would make dependency injection for testing slightly harder, it massively simplifies the data flow.

### 2. **Flat List with Injected Headers**
*   **Decision:** In `InboxLayout`, I derive two separate lists (`aiHandling`, `needsYou`) but merge them into a single `displayList` for rendering, injecting "Header" objects directly into the array.
*   **Code:** `const displayList = createMemo(() => [AI_HEADER, ...aiHandling(), NEEDS_HEADER, ...needsYou()]);`
*   **Tradeoff:** This complicates the rendering logic (Requires a `type` check inside the `<For>` loop), but it simplifies the keyboard navigation and scrolling. We don't need to manage focus across two separate DOM lists; `j` and `k` simply traverse one continuous logical array.

### 3. **Decoupled Keyboard Navigation**
*   **Decision:** Keyboard events are handled by a `window` listener that manipulates a logical index, rather than relying on browser native focus (`tabindex`) or `document.activeElement`.
*   **Tradeoff:** This requires us to manually sync the `selectedId` state with the visual scroll position (TODO), but it allows for instant, lag-free navigation that feels like a native desktop app, bypassing the browser's default focus ring behavior.

### 4. **URL-Driven Selection Sync**
*   **Decision:** The `InboxDetail` route uses a `loader` to call `setSelectedId(params.id)`.
*   **Tradeoff:** We treat the URL as the "Source of Truth" for navigation, but the Store as the "Source of Truth" for data

## 🔮 What I'd Do With Another Day

1.  **Virtualization for Scaling**
    *   Currently, the list renders all items. As the inbox grows to thousands of items, DOM node count will become a bottleneck. Implementing virtualization would allow to handle infinite internal scrolling while keeping the DOM light.

2.  **Enhanced Keyboard Navigation Model**
    *   Refine the keyboard manager to be even more robust, perhaps introducing "Vi-mode" style shortcuts (j/k navigation, x to archive, etc.) to make it a truly mouse-free experience.
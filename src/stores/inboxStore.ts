import { createStore, produce } from "solid-js/store";
import { InboxItem, InboxStatus } from "../types";

// Mock Data Generator
const generateMockData = (): InboxItem[] => [
  {
    id: "1",
    requester: { name: "Sarah Connor", team: "Security" },
    subject: "Terminator access request",
    summary: "Requesting access to Skynet API.",
    status: "agent_working",
    priority: "high",
    created_at: new Date().toISOString(),
    agent_response: "",
    is_streaming: true,
  },
  {
    id: "2",
    requester: { name: "Neo", team: "Engineering" },
    subject: "Matrix Glitch",
    summary: "Déjà vu reported in sector 7.",
    status: "needs_approval",
    priority: "urgent",
    created_at: new Date().toISOString(),
    agent_response: "I've isolated the anomaly.",
    is_streaming: false,
  },
  {
    id: "3",
    requester: { name: "Alice Bowman", team: "Cloud Infra" },
    subject: "Kubernetes Cluster Scaling",
    summary: "Cluster autoscaler is not responding to load spikes.",
    status: "needs_clarification",
    priority: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    agent_response: "Which region is affected? I need the cluster logs.",
    is_streaming: false,
  },
  {
    id: "4",
    requester: { name: "Toby Flenderson", team: "HR" },
    subject: "New Hire Onboarding Script",
    summary: "Automate LDAP account creation for batch hires.",
    status: "agent_working",
    priority: "low",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    agent_response: "Generating PowerShell script...",
    is_streaming: true,
  },
  {
    id: "5",
    requester: { name: "Oscar Martinez", team: "Finance" },
    subject: "Q4 Report Anomalies",
    summary: "Detected slight variance in ledger vs reporting tool.",
    status: "agent_stuck",
    priority: "high",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    agent_response: "I cannot reconcile the data sources. Missing permissions for Table X.",
    is_streaming: false,
  },
  {
    id: "6",
    requester: { name: "Elliot Alderson", team: "Security" },
    subject: "Firewall Rule Update",
    summary: "Block outbound traffic to unknown IP range.",
    status: "agent_resolved",
    priority: "urgent",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    agent_response: "Applied rule #90210. Traffic blocked.",
    is_streaming: false,
  },
  {
    id: "7",
    requester: { name: "Gilfoyle", team: "DevOps" },
    subject: "CI/CD Pipeline Failure",
    summary: "Build failing on stage 3 due to dependency conflict.",
    status: "needs_approval",
    priority: "urgent",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    agent_response: "Proposed fix: Pin dependency version in package.json.",
    is_streaming: false,
  },
  {
    id: "8",
    requester: { name: "Gavin Belson", team: "Product" },
    subject: "Feature Flag Evaluation",
    summary: "Analyze engagement metrics for 'Hooli Search'.",
    status: "agent_working",
    priority: "low",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    agent_response: "",
    is_streaming: false,
  },
];

const [state, setState] = createStore({
  items: generateMockData(),
  selectedId: null as string | null,
});

// ACTIONS

export const getInboxState = () => state;

export const setSelectedId = (id: string | null) => {
  setState("selectedId", id);
};

// Simulation of "Token-by-Token" streaming
export const simulateAgentStream = (id: string) => {
  const targetResponse = "Analyzing request... Access denied due to paradox risk.";
  let currentIndex = 0;

  setState("items", (item) => item.id === id, "agent_response", "");
  setState("items", (item) => item.id === id, "is_streaming", true);

  const interval = setInterval(() => {
    if (currentIndex >= targetResponse.length) {
      clearInterval(interval);
      setState("items", (item) => item.id === id, "is_streaming", false);
      // Auto-move to resolved after simulation
      updateItemStatus(id, "agent_resolved");
      return;
    }

    setState(
      "items",
      (item) => item.id === id,
      "agent_response",
      (prev) => prev + targetResponse[currentIndex]
    );
    currentIndex++;
  }, 50);
};

export const updateItemStatus = (id: string, newStatus: InboxStatus) => {
  setState(
    "items",
    (item) => item.id === id,
    produce((item) => {
      item.status = newStatus;
      // Reset streaming if moved back to working
      if (newStatus === 'agent_working') {
        item.is_streaming = true;
        item.agent_response = "";
        // Trigger simulation side-effect (in real app, this happens on backend)
        setTimeout(() => simulateAgentStream(id), 100);
      }
    })
  );
};
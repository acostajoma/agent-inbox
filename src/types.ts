export type InboxStatus =
  | 'agent_working'
  | 'agent_resolved'
  | 'needs_clarification'
  | 'needs_approval'
  | 'agent_stuck';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type InboxItem = {
  id: string;
  requester: { name: string; team: string; avatar?: string };
  subject: string;
  summary: string;
  status: InboxStatus;
  priority: Priority;
  created_at: string;
  agent_response: string;
  is_streaming: boolean;
};
import { TutorResponse } from "./services/gemini";

export interface Interaction extends TutorResponse {
  id: string;
  timestamp: number;
  studentQuery: string;
  hasImage: boolean;
}

export function saveInteraction(
  interaction: Omit<Interaction, "id" | "timestamp">
) {
  const interactions = getInteractions();
  const newInteraction: Interaction = {
    ...interaction,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };
  interactions.push(newInteraction);
  localStorage.setItem("titantrack_interactions", JSON.stringify(interactions));
  window.dispatchEvent(new Event("titantrack_updated"));
}

export function getInteractions(): Interaction[] {
  const data = localStorage.getItem("titantrack_interactions");
  return data ? JSON.parse(data) : [];
}

export function clearInteractions() {
  localStorage.removeItem("titantrack_interactions");
  window.dispatchEvent(new Event("titantrack_updated"));
}

export type SceneLanguage = "en" | "mn";
export type SceneWords = readonly [string, string];
export type SceneKind = "app" | "process" | "computer" | "cpu" | "cpu-core" | "ram" | "storage" | "image-file" | "text-file" | "software" | "desktop" | "terminal" | "code" | "person" | "server" | "contacts" | "shield" | "key" | "package" | "folder";
export type SceneContent = "drawing" | "text" | "names" | "music" | "code" | "contacts" | "work";

export interface SceneNode {
  id: string;
  kind: SceneKind;
  label: SceneWords;
  detail?: SceneWords;
  status?: SceneWords;
  tone?: "normal" | "active" | "muted" | "blocked";
  /** Visible contents, not decorative icons. Absence means the object is empty. */
  content?: SceneContent;
  /** Literal text to show on the object; descriptions and paths are not inferred. */
  ink?: SceneWords;
}

export interface SceneRelation {
  from: string;
  to: string;
  kind: "request" | "copy" | "access" | "uses";
  label: SceneWords;
}

export interface SceneAction {
  id: string;
  label: SceneWords;
  to: string;
}

export interface SceneState {
  id: string;
  title: SceneWords;
  description: SceneWords;
  nodes: readonly SceneNode[];
  relations?: readonly SceneRelation[];
  /** A software collection boundary, never a flow or physical layer. */
  container?: SceneWords;
  actions: readonly SceneAction[];
}

export interface LessonScene {
  chapter: number;
  title: SceneWords;
  summary: SceneWords;
  initial: string;
  states: readonly SceneState[];
}

export function sceneWords(words: SceneWords, language: SceneLanguage): string {
  return words[language === "mn" ? 1 : 0];
}

export function sceneState(scene: LessonScene, id: string): SceneState {
  return scene.states.find((state) => state.id === id) ?? scene.states.find((state) => state.id === scene.initial)!;
}

/** Only an explicitly offered action can change this teaching example. */
export function transitionScene(scene: LessonScene, stateId: string, actionId: string): string {
  const current = sceneState(scene, stateId);
  return current.actions.find((action) => action.id === actionId)?.to ?? current.id;
}

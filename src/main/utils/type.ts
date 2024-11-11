type ImageMessage = { tag: 'img'; image_key: string };
type TextMessage = { tag: 'text'; text: string; style: string[] };

export type { ImageMessage, TextMessage };

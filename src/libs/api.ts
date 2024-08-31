import { z } from 'zod';

export interface ApiConfig {
  url: string;
}

export const modelSchema = z.object({
  name: z.string(),
});
export type Model = z.infer<typeof modelSchema>;

export async function fetchListModels(config: ApiConfig) {
  const json = await fetch(`${config.url}/api/tags`).then((resp) => resp.json());
  return json.models.map((model: any) => modelSchema.parse(model));
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function postChatStream(
  config: ApiConfig,
  modelName: string,
  messages: ChatMessage[],
  options?: {
    signal?: AbortSignal;
  },
) {
  console.log('send', JSON.stringify(messages, null, 2));

  return fetch(`${config.url}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages,
    }),
    signal: options?.signal,
  })
    .then((resp) => resp.body)
    .then((body) => {
      const reader = body?.getReader();
      if (!reader) throw new Error('No reader');
      return reader;
    });
}

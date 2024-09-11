import { type OllamaMessage, type OllamaModel, ollamaModelSchema } from '../entities';

export interface ApiConfig {
  url: string;
}

export async function fetchListModels(config: ApiConfig): Promise<OllamaModel[]> {
  const json = await fetch(`${config.url}/api/tags`).then((resp) => resp.json());
  return json.models.map((model: unknown) => ollamaModelSchema.parse(model));
}

export function postChatStream(
  config: ApiConfig,
  modelName: string,
  messages: OllamaMessage[],
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

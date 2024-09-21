import type { GlobalConfig } from '../contexts';
import { type OllamaMessage, type OllamaModel, ollamaModelSchema } from '../entities';

export interface ApiConfig {
  url: string;
  fetchFns: GlobalConfig['fetchFns'];
}

export async function fetchListModels(config: ApiConfig): Promise<OllamaModel[]> {
  const json = await config.fetchFns.fetchJsonFn<{ models: unknown[] }>(`${config.url}/api/tags`);
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
  return config.fetchFns.fetchReaderFn(`${config.url}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages,
    }),
    signal: options?.signal,
  });
}

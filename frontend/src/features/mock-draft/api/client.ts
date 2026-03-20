type ApiErrorDetailItem = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

type ApiErrorBody = {
  detail?: string | ApiErrorDetailItem[] | Record<string, unknown> | null;
  message?: string | null;
};

export async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function formatApiErrorMessage(
  data: ApiErrorBody | null,
  fallbackMessage: string,
): string {
  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const first = data.detail[0];
    if (first?.msg) {
      return first.msg;
    }
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
}

export async function handleApiResponse<T>(
  res: Response,
  fallbackMessage: string,
): Promise<T> {
  const data = await parseJsonSafe<T | ApiErrorBody>(res);

  if (!res.ok) {
    const message = formatApiErrorMessage(
      (data as ApiErrorBody | null) ?? null,
      fallbackMessage,
    );
    throw new Error(message);
  }

  if (!data) {
    throw new Error(fallbackMessage);
  }

  return data as T;
}

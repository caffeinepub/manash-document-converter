declare module '@imgly/background-removal' {
  export function removeBackground(
    image: Blob | File | string,
    config?: Record<string, unknown>
  ): Promise<Blob>;
}

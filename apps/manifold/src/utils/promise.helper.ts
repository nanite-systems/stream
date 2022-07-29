export function sleep(time: number, unref = false): Promise<void> {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, time);

    if (unref) timeout.unref();
  });
}

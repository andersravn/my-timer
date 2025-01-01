export function formatDuration(durationInSeconds: number) {
  const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor(durationInSeconds % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

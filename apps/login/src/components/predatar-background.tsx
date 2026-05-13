export function PredatarBackground({ imageUrl }: { imageUrl: string | null }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }}
    />
  );
}

type Pose = "welcome" | "voice" | "location" | "direction" | "documents" | "safety" | "contact" | "review";
const poses: Pose[] = ["welcome", "voice", "location", "direction", "documents", "safety", "contact", "review"];
/** The same clay companion and tile proportions as the beneficiary app. */
export default function ParalegalIllustration({ pose = "welcome", size = 96 }: { pose?: Pose; size?: number }) {
  const tile = poses.indexOf(pose);
  return <div aria-hidden="true" className="relative shrink-0 overflow-hidden rounded-2xl" style={{ width: size, height: size, background: "linear-gradient(135deg, #F8EEF2, #E3F1EF)" }}>
    <img src="/illustrations/civic-steps.webp" alt="" draggable={false} style={{ position: "absolute", width: size * 4, maxWidth: "none", height: size * 2, left: -(tile % 4) * size, top: -Math.floor(tile / 4) * size }} />
    <div className="absolute inset-0" style={{ background: "linear-gradient(transparent 73%, white)" }} />
  </div>;
}

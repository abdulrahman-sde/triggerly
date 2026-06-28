import { NodeSelector } from "@/features/editor/components/node-selector";

export default async function Home() {
  return (
    <div>
      <NodeSelector open={true} />
    </div>
  );
}

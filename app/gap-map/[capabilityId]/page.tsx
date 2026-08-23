import { notFound } from "next/navigation";
import { CapabilityDetail } from "@/components/diagnostic/capability-detail";
import { CAPABILITIES } from "@/lib/diagnostic/capabilities";

export function generateStaticParams() {
  return CAPABILITIES.map((capability) => ({ capabilityId: capability.id }));
}

export default async function CapabilityPage(props: PageProps<"/gap-map/[capabilityId]">) {
  const { capabilityId } = await props.params;

  if (!CAPABILITIES.some((capability) => capability.id === capabilityId)) notFound();

  return <CapabilityDetail capabilityId={capabilityId} />;
}

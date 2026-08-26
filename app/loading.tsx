import { VaultLoader } from "@/components/ui/loading";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <VaultLoader />
    </div>
  );
}

import { Suspense } from "react";

import ResetForm from "@/components/auth/ResetForm";
import Loading from "@/components/elements/Loading";

export default function ResetPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetForm />
    </Suspense>
  );
}

import { RequestDetailClient } from "./_sections/request-detail-client";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <RequestDetailClient id={id} />;
}

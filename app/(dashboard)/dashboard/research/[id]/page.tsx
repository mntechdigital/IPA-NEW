import { redirect } from 'next/navigation';

export default async function ResearchIdRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/research/${id}/edit`);
}

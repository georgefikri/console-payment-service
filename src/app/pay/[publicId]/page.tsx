import PaymentLinkActions from '@/components/PaymentLinkActions';

interface PaymentLinkPageProps {
  params: Promise<{ publicId: string }>;
}

export default async function PaymentLinkPage({ params }: PaymentLinkPageProps) {
  const { publicId } = await params;
  
  return <PaymentLinkActions publicId={publicId} />;
}

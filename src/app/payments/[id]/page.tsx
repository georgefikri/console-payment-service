import PaymentDetailsView from '@/components/PaymentDetailsView';

interface PaymentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailsPage({ params }: PaymentDetailsPageProps) {
  const { id } = await params;
  
  return <PaymentDetailsView id={id} />;
}

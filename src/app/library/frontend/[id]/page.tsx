import { ComponentService } from "@/lib/api"
import { notFound } from 'next/navigation';
import ClientFrontendComponent from './client';

// Dynamic rendering for component pages that are edited/created
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-side component that fetches data and passes to client component
export default async function FrontendComponentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Handle "new" component case
  if (id === 'new') {
    return <ClientFrontendComponent id={id} initialComponent={null} />;
  }

  // Fetch component data server-side
  try {
    const component = await ComponentService.getComponentById(id);
    
    // If component not found
    if (!component) {
      notFound();
    }
    
    return <ClientFrontendComponent id={id} initialComponent={component} />;
  } catch (err) {
    console.error('Failed to fetch component:', err);
    notFound();
  }
}
import { ComponentService } from "@/lib/api";
import { notFound } from 'next/navigation';
import ClientBackendComponent from './client';

// Dynamic rendering for component pages that are edited/created
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-side component that fetches data and passes to client component
export default async function BackendComponentDetailPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  // Handle "new" component case
  if (id === 'new') {
    return <ClientBackendComponent id={id} initialComponent={null} />;
  }

  // Fetch component data server-side
  try {
    const component = await ComponentService.getComponentById(id);
    
    // If component not found
    if (!component) {
      notFound();
    }
    
    return <ClientBackendComponent id={id} initialComponent={component} />;
  } catch (err) {
    console.error('Failed to fetch component:', err);
    notFound();
  }
}
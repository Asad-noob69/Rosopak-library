"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { BookOpen, Code, Database, FileCode, Home, Library, MenuIcon, Plus, Search, Server, Settings } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ComponentService } from "@/lib/api"
import { Button } from "@/components/ui/button"

// Define component type
type Component = {
  id: string;
  name: string;
  description?: string; // Make description optional
  code?: string;
  type: 'frontend' | 'backend';
};

// Floating Sidebar Trigger Button Component
function FloatingSidebarTrigger() {
  const { state, toggleSidebar } = useSidebar()
  
  return (
    <Button
      onClick={toggleSidebar}
      className={`fixed left-4 top-4 z-50 size-10 rounded-full shadow-md md:${state === 'collapsed' ? 'flex' : 'hidden'}`}
      size="icon"
      variant="secondary"
    >
      <MenuIcon className="size-5" />
      <span className="sr-only">Open Sidebar</span>
    </Button>
  )
}

export function AppSidebar() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for components
  const [backendComponents, setBackendComponents] = useState<Component[]>([]);
  const [frontendComponents, setFrontendComponents] = useState<Component[]>([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  // Fetch components when the component mounts
  useEffect(() => {
    async function fetchComponents() {
      setIsLoading(true);
      try {
        // Fetch backend components
        const backendData = await ComponentService.getComponentsByType('backend');
        setBackendComponents(backendData);
        
        // Fetch frontend components
        const frontendData = await ComponentService.getComponentsByType('frontend');
        setFrontendComponents(frontendData);
      } catch (error) {
        console.error('Failed to fetch components:', error);
        
        // Set default components if API fails
        setBackendComponents([
          { id: "be1", name: "Express API Controller", description: "Standard REST API controller template", type: 'backend' },
          { id: "be2", name: "MongoDB Connection", description: "Database connection utility", type: 'backend' },
          { id: "be3", name: "Auth Middleware", description: "JWT authentication middleware", type: 'backend' },
        ]);
        
        setFrontendComponents([
          { id: "fe1", name: "Data Table", description: "Sortable and filterable table component", type: 'frontend' },
          { id: "fe2", name: "Form Builder", description: "Dynamic form generation component", type: 'frontend' },
          { id: "fe3", name: "Modal Dialog", description: "Customizable modal component", type: 'frontend' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchComponents();
  }, []);

  // Filter components based on search query
  const filteredBackendComponents = backendComponents.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFrontendComponents = frontendComponents.filter(component => 
    component.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <h2 className="text-lg font-semibold font-[tusker]">Rosopak Library</h2>
            <SidebarTrigger className="ml-auto" />
          </div>
          <div className="px-2 pb-2">
            <SidebarInput 
              placeholder="Search components..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              type="search"
              autoComplete="off"
            />
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home className="mr-2" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Library">
                  <Link href="/library">
                    <Library className="mr-2" />
                    <span>Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Books">
                  <Link href="/books">
                    <BookOpen className="mr-2" />
                    <span>Books</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Component Library</SidebarGroupLabel>
            <SidebarMenu>
              {/* Backend Components Section */}

              <SidebarMenuItem>
              <Link href="/library/backend">
                <SidebarMenuButton tooltip="Backend Components">
                  <Server className="mr-2" />
                    <span>Backend</span>
                </SidebarMenuButton>
                </Link>

                
                <SidebarMenuSub>
                  {isLoading ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Loading components...</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : filteredBackendComponents.length > 0 ? (
                    filteredBackendComponents.map(component => (
                      <SidebarMenuSubItem key={component.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/library/backend/${component.id}`}>
                            <Database className="mr-2 h-4 w-4" />
                            <span>{component.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>No components found</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/library/backend/new" className="text-muted-foreground">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add New Component</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              
              {/* Frontend Components Section */}
              <SidebarMenuItem>
                <Link href="/library/frontend">
                  <SidebarMenuButton tooltip="Frontend Components">
                    <Code className="mr-2" />
                    <span>Frontend</span>
                  </SidebarMenuButton>
                </Link>
                  
                <SidebarMenuSub>
                  {isLoading ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Loading components...</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : filteredFrontendComponents.length > 0 ? (
                    filteredFrontendComponents.map(component => (
                      <SidebarMenuSubItem key={component.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/library/frontend/${component.id}`}>
                            <FileCode className="mr-2 h-4 w-4" />
                            <span>{component.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>No components found</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/library/frontend/new" className="text-muted-foreground">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add New Component</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/settings">
                    <Settings className="mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="px-4 py-2 text-xs text-muted-foreground">
            © 2025 Rosopak Library
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

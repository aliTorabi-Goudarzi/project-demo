'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { getGalleryById } from '@/lib/gallery';
import { getProjectById } from '@/lib/projects';

import { ProjectModal } from './ProjectModal';
import { ProjectModalContext } from './ProjectModalContext';
import type { ModalItem } from './ProjectModalContext';

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<ModalItem | null>(null);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setActiveItem(null);
  }, [pathname]);

  const openProject = useCallback((id: string) => {
    const project = getProjectById(id);
    if (!project) return;
    setActiveItem({
      title: project.title,
      image: project.image,
      client: project.client,
      location: project.location,
      year: project.year,
      category: project.category,
      description: project.description,
    });
  }, []);

  const openGalleryItem = useCallback((id: string) => {
    const project = getGalleryById(id);
    if (!project) return;
    setActiveItem({
      title: project.title,
      image: project.image,
      client: project.client,
      location: project.loc,
      year: project.year,
      category: project.cat,
      description: project.description,
    });
  }, []);

  const close = useCallback(() => setActiveItem(null), []);

  const value = useMemo(
    () => ({ activeItem, openProject, openGalleryItem, close }),
    [activeItem, openProject, openGalleryItem, close],
  );

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      <ProjectModal />
    </ProjectModalContext.Provider>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { getGalleryById } from '@/lib/gallery';
import { getProjectById } from '@/lib/projects';

import { ProjectModalContext } from './ProjectModalContext';
import type { ModalItem } from './ProjectModalContext';

const ProjectModal = dynamic(
  () => import('./ProjectModal').then((module) => module.ProjectModal),
  { ssr: true },
);

const modalPlaceholder = (
  <div
    id="projectModal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
    aria-hidden="true"
    inert
  />
);

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<ModalItem | null>(null);
  const [modalReady, setModalReady] = useState(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setActiveItem(null);
  }, [pathname]);

  const openProject = useCallback((id: string) => {
    const project = getProjectById(id);
    if (!project) return;
    setModalReady(true);
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
    setModalReady(true);
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
      {modalReady ? (
        <Suspense fallback={modalPlaceholder}>
          <ProjectModal />
        </Suspense>
      ) : (
        modalPlaceholder
      )}
    </ProjectModalContext.Provider>
  );
}

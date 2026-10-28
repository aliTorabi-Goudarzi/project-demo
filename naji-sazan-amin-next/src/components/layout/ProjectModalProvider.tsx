'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

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
      images: project.images,
      service: project.service,
      type: project.type,
      location: project.location,
      scope: project.scope,
      description: project.description,
    });
  }, []);

  const close = useCallback(() => setActiveItem(null), []);

  const value = useMemo(
    () => ({ activeItem, openProject, close }),
    [activeItem, openProject, close],
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

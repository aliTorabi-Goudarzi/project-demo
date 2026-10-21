'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { GALLERY_PROJECTS } from '@/lib/gallery';
import { PROJECTS } from '@/lib/projects';

import { ProjectModal } from './ProjectModal';

export type ModalItem = {
  id: string;
  title: string;
  image: string;
  client: string;
  location: string;
  year: string;
  category: string;
  description: string;
};

type ProjectModalContextValue = {
  activeItem: ModalItem | null;
  openProject: (id: string) => void;
  openGalleryItem: (id: string) => void;
  close: () => void;
};

const ProjectModalContext = createContext<ProjectModalContextValue | null>(null);

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<ModalItem | null>(null);

  const openProject = useCallback((id: string) => {
    const project = PROJECTS.find((item) => item.id === id);
    if (!project) return;
    setActiveItem({
      id: project.id,
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
    const project = GALLERY_PROJECTS.find((item) => item.id === id);
    if (!project) return;
    setActiveItem({
      id: project.id,
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

export function useProjectModal(): ProjectModalContextValue {
  const context = useContext(ProjectModalContext);
  if (!context) {
    throw new Error('useProjectModal must be used within ProjectModalProvider');
  }
  return context;
}

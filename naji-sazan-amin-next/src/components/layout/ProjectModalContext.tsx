'use client';

import { createContext, useContext } from 'react';

export type ModalItem = {
  title: string;
  image: string;
  client: string;
  location: string;
  year: string;
  category: string;
  description: string;
};

export type ProjectModalContextValue = {
  activeItem: ModalItem | null;
  openProject: (id: string) => void;
  openGalleryItem: (id: string) => void;
  close: () => void;
};

export const ProjectModalContext = createContext<ProjectModalContextValue | null>(null);

export function useProjectModal(): ProjectModalContextValue {
  const context = useContext(ProjectModalContext);
  if (!context) {
    throw new Error('useProjectModal must be used within ProjectModalProvider');
  }
  return context;
}

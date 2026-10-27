'use client';

import { useState } from 'react';

import { useProjectModal } from '@/components/layout/ProjectModalContext';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { PROJECTS, PROJECT_CATEGORIES } from '@/lib/projects';

const counts: Record<string, number> = { all: PROJECTS.length };
for (const project of PROJECTS) {
  counts[project.categorySlug] = (counts[project.categorySlug] ?? 0) + 1;
}

export function ProjectsExplorer() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { openProject } = useProjectModal();

  return (
    <section className="section">
      <div className="container">
        <div className="filter-bar filter-bar--pills reveal" id="filterBar">
          {PROJECT_CATEGORIES.map((category) => {
            const active = category.slug === activeCategory;
            return (
              <button
                key={category.slug}
                type="button"
                className={active ? 'chip is-active' : 'chip'}
                data-cat={category.slug}
                aria-pressed={active}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.label} <span className="n">({counts[category.slug] ?? 0})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-2" id="projectGrid">
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              className="project spotlight-card reveal"
              data-project={project.id}
              data-cat={project.categorySlug}
              data-delay={index % 3 ? String(index % 3) : undefined}
              role="button"
              tabIndex={0}
              aria-label={`مشاهده پروژه ${project.title}`}
              style={{
                display:
                  activeCategory === 'all' || project.categorySlug === activeCategory
                    ? undefined
                    : 'none',
              }}
              onClick={() => openProject(project.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openProject(project.id);
                }
              }}
            >
              <div className="project__media">
                <ResponsiveImage
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={600}
                  widths={[400, 600]}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : undefined}
                />
              </div>
              <div className="project__body">
                <span className="project__cat">{project.category}</span>
                <h3 className="project__title">{project.title}</h3>
                <p className="project__summary">{project.summary}</p>
                <div className="project__foot">
                  <span>{project.location}</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

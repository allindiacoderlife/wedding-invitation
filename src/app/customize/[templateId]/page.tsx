import React from 'react';
import { notFound } from 'next/navigation';
import { getTemplateById, getAllTemplates } from '@/data/templates';
import { EditorialFormWizard } from '@/components/wizard/EditorialFormWizard';

interface PageProps {
  params: Promise<{
    templateId: string;
  }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({
    templateId: t.id,
  }));
}

export default async function CustomizePage({ params }: PageProps) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  return <EditorialFormWizard template={template} />;
}

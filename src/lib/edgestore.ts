'use client';

import { type EdgeStoreRouter } from '@/lib/edgestore-server';
import { createEdgeStoreProvider } from '@edgestore/react';

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });

export { EdgeStoreProvider, useEdgeStore };

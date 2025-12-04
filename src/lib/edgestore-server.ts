import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { initEdgeStoreClient } from '@edgestore/server/core';

const es = initEdgeStore.create();

/**
 * This is the main router for the EdgeStore buckets
 */
export const edgeStoreRouter = es.router({
  myPublicImages: es.imageBucket(),
  myPublicFiles: es.fileBucket(),
});

/**
 * Export the handler for the API route
 */
export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

/**
 * Export a type-safe backend client
 */
export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
  // EdgeStore will automatically use the environment variables
  // EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY
});

/**
 * This type is used to create the type-safe client for the frontend
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
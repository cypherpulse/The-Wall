// Content management system for "The Wall"
// Handles storing and retrieving content associated with hashes

const CONTENT_STORAGE_KEY = 'the-wall-content';

// In-memory cache for faster access
const contentCache = new Map<string, string>();

// Store content locally (can be replaced with IPFS/database)
export function storeContent(content: string, contentHash: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      // Store in localStorage for persistence
      const stored = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '{}');
      stored[contentHash] = {
        content,
        timestamp: Date.now(),
      };
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(stored));

      // Update cache
      contentCache.set(contentHash, content);

      resolve();
    } catch (error) {
      console.error('Failed to store content:', error);
      // Fallback to cache only
      contentCache.set(contentHash, content);
      resolve();
    }
  });
}

// Retrieve content by hash
export function getContent(contentHash: string): Promise<string | null> {
  return new Promise((resolve) => {
    // Check cache first
    if (contentCache.has(contentHash)) {
      resolve(contentCache.get(contentHash)!);
      return;
    }

    try {
      // Check localStorage
      const stored = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '{}');
      const item = stored[contentHash];

      if (item && item.content) {
        // Update cache
        contentCache.set(contentHash, item.content);
        resolve(item.content);
        return;
      }
    } catch (error) {
      console.error('Failed to retrieve content from storage:', error);
    }

    // Content not found
    resolve(null);
  });
}

// Get all stored content (for debugging/admin purposes)
export function getAllStoredContent(): Record<string, { content: string; timestamp: number }> {
  try {
    return JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

// Clear old content (cleanup function)
export function clearOldContent(daysOld: number = 30): void {
  try {
    const stored = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '{}');
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

    const filtered: Record<string, any> = {};
    let cleared = 0;

    for (const [hash, item] of Object.entries(stored)) {
      if (item.timestamp > cutoffTime) {
        filtered[hash] = item;
      } else {
        cleared++;
        contentCache.delete(hash);
      }
    }

    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(filtered));
    console.log(`Cleared ${cleared} old content items`);
  } catch (error) {
    console.error('Failed to clear old content:', error);
  }
}

// React hook for content management
import { useState, useEffect } from 'react';

export function useContent(contentHash: string | undefined) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentHash) {
      setContent(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getContent(contentHash)
      .then((result) => {
        setContent(result);
        if (!result) {
          setError('Content not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load content');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [contentHash]);

  const saveContent = async (newContent: string) => {
    if (!contentHash) return;

    try {
      await storeContent(newContent, contentHash);
      setContent(newContent);
      setError(null);
    } catch (err) {
      setError('Failed to save content');
    }
  };

  return {
    content,
    isLoading,
    error,
    saveContent,
  };
}

// Batch content loader for multiple hashes
export function useBatchContent(contentHashes: (string | undefined)[]) {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const validHashes = contentHashes.filter(Boolean) as string[];
    if (validHashes.length === 0) return;

    setIsLoading(true);
    const newContents: Record<string, string> = {};
    const newErrors: Record<string, string> = {};

    Promise.allSettled(
      validHashes.map(hash => getContent(hash))
    ).then((results) => {
      results.forEach((result, index) => {
        const hash = validHashes[index];
        if (result.status === 'fulfilled' && result.value) {
          newContents[hash] = result.value;
        } else {
          newErrors[hash] = 'Content not found';
        }
      });

      setContents(newContents);
      setErrors(newErrors);
      setIsLoading(false);
    });
  }, [contentHashes]);

  return {
    contents,
    isLoading,
    errors,
  };
}
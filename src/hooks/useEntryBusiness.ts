'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

type Options = {
  storageKey?: string;
  queryKey?: string;
  pathname?: string;
  storage?: 'local';
  ignoreSeenOnQuery?: boolean;
};

const useEntryBusiness = ({
  storageKey = 'businessCreateModal',
  queryKey = 'create',
  pathname = '/business',
  ignoreSeenOnQuery = false,
}: Options = {}) => {
  const [open, setOpen] = useState(false);
  const ranRef = useRef(false);

  const getStore = () => window.localStorage;

  const readHasQuery = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const sp = new URLSearchParams(window.location.search);
    return sp.get(queryKey) === 'true';
  }, [queryKey]);

  const stripQuery = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (typeof window === 'undefined') return;

    const store = getStore();
    const seen = store.getItem(storageKey) === '1';
    const hasQuery = readHasQuery();

    if (seen && !ignoreSeenOnQuery) {
      if (hasQuery) stripQuery();
      setOpen(false);
      return;
    }

    if (hasQuery) {
      setOpen(true);
      stripQuery();
      return;
    }

    if (!seen) setOpen(true);
  }, [storageKey, readHasQuery, stripQuery, ignoreSeenOnQuery]);

  const close = () => setOpen(false);

  const confirm = () => {
    const store = getStore();
    store.setItem(storageKey, '1');
    setOpen(false);
  };

  const openModal = () => {
    const store = getStore();
    const seen = store.getItem(storageKey) === '1';
    if (seen && !ignoreSeenOnQuery) return;
    setOpen(true);
  };

  return { open, close, confirm, openModal, stripQuery };
};

export default useEntryBusiness;

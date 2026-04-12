import { create } from 'zustand';

import { childrenService } from '../services/children/childrenService';
import { storageService } from '../services/storage/storageService';

import { STORAGE_KEYS } from '../shared/constants/storage';
import { Child } from '../shared/types/child';

interface ChildrenState {
  children: Child[];
  activeChild: Child | null;
  loading: boolean;

  fetchChildren: (parentId: string) => Promise<void>;
  setActiveChild: (child: Child) => void;
  restoreActiveChild: (parentId: string) => Promise<void>;
  clearChildren: () => void;
}

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  activeChild: null,
  loading: false,

  fetchChildren: async (parentId: string) => {
    set({ loading: true });
    try {
      const { data: children } = await childrenService.getChildrenByParent(
        parentId,
      );
      set({ children });

      // Auto-select pertama jika belum ada active child
      const { activeChild } = get();
      if (!activeChild && children.length > 0) {
        const first = children[0];
        set({ activeChild: first });
        await storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, first.id);
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setActiveChild: (child: Child) => {
    set({ activeChild: child });
    storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, child.id);
  },

  restoreActiveChild: async (parentId: string) => {
    set({ loading: true });
    try {
      const { data: children } = await childrenService.getChildrenByParent(
        parentId,
      );
      set({ children });

      const savedChildId = await storageService.get(
        STORAGE_KEYS.ACTIVE_CHILD_ID,
      );

      if (savedChildId) {
        const found = children.find(c => c.id === savedChildId);
        if (found) {
          set({ activeChild: found });
          return;
        }
      }

      if (children.length > 0) {
        const first = children[0];
        set({ activeChild: first });
        await storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, first.id);
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearChildren: () => {
    set({ children: [], activeChild: null });
    storageService.remove(STORAGE_KEYS.ACTIVE_CHILD_ID);
  },
}));

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface Project {
  id: string;
  title: string;
  type: string;
  bpm: number;
  data: any;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

interface ProjectContextType {
  project: Project | null;
  saveProject: () => Promise<void>;
  updateProject: (updates: Partial<Project>) => void;
  createNew: (type: string) => void;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-save every 30s
  useEffect(() => {
    if (!project || !user) return;
    const interval = setInterval(() => {
      saveProject();
    }, 30000);
    return () => clearInterval(interval);
  }, [project, user]);

  const saveProject = async () => {
    if (!project || !user) return;
    
    const path = `projects/${project.id}`;
    try {
      await setDoc(doc(db, path), {
        ...project,
        ownerId: user.uid,
        updatedAt: serverTimestamp(),
        createdAt: project.createdAt || serverTimestamp(),
      });
      console.log("Project saved to cloud.");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const createNew = (type: string) => {
    if (!user) {
      alert("Please login to create projects.");
      return;
    }
    const newProj: Project = {
      id: uuidv4(),
      title: 'Untitled ' + type,
      type,
      bpm: 120,
      data: { tracks: [] },
      ownerId: user.uid,
      createdAt: null, // Will be set by serverTimestamp on first save
      updatedAt: null
    };
    setProject(newProj);
  };

  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <ProjectContext.Provider value={{ project, saveProject, updateProject, createNew, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};

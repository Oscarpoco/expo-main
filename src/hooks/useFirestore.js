import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data.filter((t) => t.createdBy === user.uid));
      setLoading(false);
    });
    return unsubscribe;
  }, [user?.uid]);

  return { tasks, loading };
}

export async function createTask(taskData, user) {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...taskData,
    createdBy: user.uid,
    createdByName: user.displayName || user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await addDoc(collection(db, 'taskHistory'), {
    taskId: docRef.id,
    action: 'created',
    description: `Task "${taskData.title}" was created`,
    changedBy: user.uid,
    changedByName: user.displayName || user.email,
    timestamp: new Date().toISOString(),
  });

  return docRef.id;
}

export async function updateTask(taskId, updates, user, previousTask) {
  await updateDoc(doc(db, 'tasks', taskId), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  const changes = [];
  for (const [key, value] of Object.entries(updates)) {
    if (previousTask[key] !== value) {
      changes.push(`${key}: "${previousTask[key]}" → "${value}"`);
    }
  }

  if (changes.length > 0) {
    await addDoc(collection(db, 'taskHistory'), {
      taskId,
      action: 'updated',
      description: changes.join(', '),
      changedBy: user.uid,
      changedByName: user.displayName || user.email,
      timestamp: new Date().toISOString(),
    });
  }
}

export async function deleteTask(taskId, user, taskTitle) {
  await deleteDoc(doc(db, 'tasks', taskId));
  await addDoc(collection(db, 'taskHistory'), {
    taskId,
    action: 'deleted',
    description: `Task "${taskTitle}" was deleted`,
    changedBy: user.uid,
    changedByName: user.displayName || user.email,
    timestamp: new Date().toISOString(),
  });
}

export function useTaskHistory(taskId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!taskId || !user) return;
    const q = query(
      collection(db, 'taskHistory'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((h) => h.taskId === taskId && h.changedBy === user.uid);
      setHistory(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [taskId, user?.uid]);

  return { history, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(data.filter((p) => p.createdBy === user.uid));
      setLoading(false);
    });
    return unsubscribe;
  }, [user?.uid]);

  return { projects, loading };
}

export async function createProject(projectData, user) {
  return addDoc(collection(db, 'projects'), {
    ...projectData,
    createdBy: user.uid,
    createdByName: user.displayName || user.email,
    createdAt: new Date().toISOString(),
  });
}

export function useActivityFeed(maxItems = 25) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setActivity([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'taskHistory'),
      orderBy('timestamp', 'desc'),
      limit(maxItems * 3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.changedBy === user.uid)
        .slice(0, maxItems);
      setActivity(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user?.uid, maxItems]);

  return { activity, loading };
}

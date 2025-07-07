import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createThread } from '../services/forumService';
import { useUser } from '@/context/UserContext';

const ThreadButton = ({ categories = [], onThreadCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const user_id = user?.auth?.id;
  const username = user?.nombre_usuario;

  useEffect(() => {
    // Si cambian las categorías, selecciona la primera por defecto
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newThread = await createThread({
        title,
        content,
        user_id,
        username,
        category_id: categoryId
      });
      setTitle("");
      setContent("");
      setOpen(false);
      if (onThreadCreated) onThreadCreated(newThread);
    } catch (err) {
      alert("Error al crear hilo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="bg-red-600 hover:bg-red-700" onClick={() => setOpen(true)} disabled={!user}>
        <PlusCircle className="w-5 h-5 mr-2" />
        Crear Nuevo Hilo
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Crear Nuevo Hilo</h2>
            <form onSubmit={handleSubmit}>
              <select
                className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                disabled={categories.length === 0}
              >
                <option value="" disabled selected={categoryId === ""}>Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Título del hilo"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Contenido del hilo"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" className="bg-gray-700" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>{loading ? "Creando..." : "Crear"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ThreadButton; 
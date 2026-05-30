
import { X, Trash2, RotateCcw, Plus, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetSegments, apiGetArchivedSegments, apiCreateSegment, apiUpdateSegment, apiArchiveSegment, apiRestoreSegment } from '../api/api.ts';
import Sidebar from '../components/Sidebar.tsx';
import { isAdmin } from '../utils/roles.ts';

interface Segment {
    name: string;
    description: string;
    created_at?: string;
}

export default function SegmentsPage() {
    const { user } = useAuth();

    const [segments, setSegments] = useState<Segment[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
    const [editDescription, setEditDescription] = useState('');
    const [editError, setEditError] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [createError, setCreateError] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const fn = showDeleted ? apiGetArchivedSegments : apiGetSegments;
            const data = await fn();
            setSegments(data.segments || []);
        } catch { setSegments([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, [showDeleted]);

    const handleCreate = async () => {
        setCreateError('');
        if (!formData.name.trim()) { setCreateError('Название обязательно'); return; }
        try {
            await apiCreateSegment({ name: formData.name.trim(), description: formData.description.trim() });
            await load();
            setCreateModalOpen(false);
            setFormData({ name: '', description: '' });
        } catch (e: unknown) {
            setCreateError(e instanceof Error ? e.message : 'Ошибка создания сегмента');
        }
    };

    const handleEditClick = (seg: Segment) => {
        setEditingSegment(seg);
        setEditDescription(seg.description);
        setEditError('');
        setEditModalOpen(true);
    };

    const saveEdit = async () => {
        if (!editingSegment) return;
        setEditError('');
        try {
            await apiUpdateSegment(editingSegment.name, { description: editDescription });
            await load();
            setEditModalOpen(false);
            setEditingSegment(null);
        } catch (e: unknown) {
            setEditError(e instanceof Error ? e.message : 'Ошибка сохранения');
        }
    };

    const handleDeleteClick = (name: string) => { setSegmentToDelete(name); setDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (!segmentToDelete) return;
        try { await apiArchiveSegment(segmentToDelete); await load(); } catch { /* ignore */ }
        setDeleteModalOpen(false);
        setSegmentToDelete(null);
    };

    const handleRestore = async (name: string) => {
        try { await apiRestoreSegment(name); await load(); } catch { /* ignore */ }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Сегменты</h1>
                            <p className="text-muted-foreground">Управляйте сегментами клиентов</p>
                        </div>
                        <div className="flex gap-3">
                            {isAdmin(user?.role ?? '') && (
                            <button
                                onClick={() => setShowDeleted(!showDeleted)}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground flex items-center gap-2 bg-transparent"
                            >
                                <Trash2 className="w-4 h-4" />
                                {showDeleted ? 'Активные' : 'Архив'}
                            </button>
                            )}
                            {!showDeleted && (
                                <button
                                    onClick={() => { setFormData({ name: '', description: '' }); setCreateError(''); setCreateModalOpen(true); }}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />Новый сегмент
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
                    ) : segments.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            {showDeleted ? 'Архив пуст' : 'Нет сегментов. Создайте первый!'}
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Название</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Описание</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {segments.map((seg) => (
                                        <tr key={seg.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded">{seg.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-card-foreground">
                                                {seg.description || <span className="text-muted-foreground italic">Без описания</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    {showDeleted ? (
                                                        <button
                                                            onClick={() => handleRestore(seg.name)}
                                                            className="text-primary hover:opacity-70 bg-transparent p-0 flex items-center gap-1 text-sm"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />Восстановить
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(seg)}
                                                                className="text-muted-foreground hover:text-foreground bg-transparent p-0 flex items-center gap-1 text-sm"
                                                            >
                                                                <Pencil className="w-4 h-4" />Изменить
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(seg.name)}
                                                                className="text-destructive hover:opacity-70 bg-transparent p-0 flex items-center gap-1 text-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4" />Удалить
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Модалка создания */}
            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCreateModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-foreground">Новый сегмент</h2>
                            <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Название *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                                    placeholder="VIP, Новые, Неактивные..."
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Описание</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Краткое описание сегмента..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>
                            {createError && <p className="text-destructive text-sm">{createError}</p>}
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Создать</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка редактирования */}
            {editModalOpen && editingSegment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-foreground">Изменить сегмент</h2>
                            <button onClick={() => setEditModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Название</label>
                                <input
                                    type="text"
                                    value={editingSegment.name}
                                    disabled
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Название изменить нельзя</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Описание</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Описание сегмента..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>
                            {editError && <p className="text-destructive text-sm">{editError}</p>}
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">Сохранить</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка удаления */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModalOpen(false)}>
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Удалить сегмент</h2>
                            <button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground bg-transparent p-0"><X className="w-5 h-5" /></button>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Удалить сегмент <span className="font-semibold text-foreground">«{segmentToDelete}»</span>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition text-card-foreground bg-transparent">Отмена</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition">Удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

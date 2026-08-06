import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePencil,
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineArrowLeft
} from 'react-icons/hi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useJournal } from '@/hooks/useJournal';
import { useMood } from '@/hooks/useMood';
import { JournalCard } from '@/components/JournalCard/JournalCard';
import { MoodSelector } from '@/components/MoodSelector/MoodSelector';
import { TagInput } from '@/components/Inputs/TagInput';
import { Button } from '@/components/Buttons/Button';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { calculateWordAndCharCount, getMoodOption } from '@/utils/moodUtils';
import { getTodayDateString, formatDateFull } from '@/utils/dateUtils';
import { MoodType } from '@/types';
import { ROUTES } from '@/constants/routes';
import { MOOD_LIST } from '@/constants/moods';

export const Journal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const navigate = useNavigate();

  const { entries, saveEntry, deleteEntry, getEntryById } = useJournal();
  const { todayMood } = useMood();

  // Quill editor toolbar configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const quillFormats = [
    'header', 'font',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'align',
    'blockquote', 'code-block',
    'link', 'image',
  ];

  const [activeTab, setActiveTab] = useState<'editor' | 'list'>(id || dateParam ? 'editor' : 'list');

  const todayStr = getTodayDateString();
  const sanitizeDate = (d?: string | null) => {
    if (!d) return todayStr;
    return d > todayStr ? todayStr : d;
  };

  const [entryId, setEntryId] = useState<string | undefined>(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(sanitizeDate(dateParam));
  const [mood, setMood] = useState<MoodType>(todayMood?.mood || 'calm');
  const [tags, setTags] = useState<string[]>([]);

  const modeParam = searchParams.get('mode');
  const [isEditing, setIsEditing] = useState<boolean>(!id || modeParam === 'edit');

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (id) {
      const existing = getEntryById(id);
      if (existing) {
        setEntryId(existing.id);
        setTitle(existing.title);
        setContent(existing.content);
        setDate(existing.date);
        setMood(existing.mood);
        setTags(existing.tags || []);
        setActiveTab('editor');
        setIsEditing(mode === 'edit');
      }
    } else {
      setEntryId(undefined);
      setTitle('');
      setContent('');
      setDate(sanitizeDate(dateParam));
      setMood(todayMood?.mood || 'calm');
      setTags([]);
      setIsEditing(true);
      setActiveTab(dateParam ? 'editor' : 'list');
    }
  }, [id, dateParam, searchParams, getEntryById, todayMood]);
  const { words, chars, readingTime } = calculateWordAndCharCount(content);

  // Track unsaved changes when any field is modified
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!title.trim() && !content.trim()) return;
    setSaveStatus('unsaved');
  }, [title, content, date, mood, tags]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    setSaveStatus('saving');
    const saved = saveEntry({
      id: entryId,
      title: title || 'Untitled Entry',
      content,
      date,
      mood,
      tags,
    });

    if (!entryId) {
      setEntryId(saved.id);
    }

    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCreateNew = () => {
    navigate(ROUTES.JOURNAL);
    setEntryId(undefined);
    setTitle('');
    setContent('');
    setDate(getTodayDateString());
    setMood('calm');
    setTags([]);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleDelete = (targetId: string) => {
    deleteEntry(targetId);
    if (targetId === entryId) {
      handleCreateNew();
    }
  };

  // Search filter strictly matches ONLY Title and Tags
  const filteredEntries = entries.filter((e) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      e.title.toLowerCase().includes(query) ||
      e.tags?.some((t) => t.toLowerCase().includes(query));
    const matchesMood = selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b-3 border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          {id && (
            <button
              onClick={() => navigate(ROUTES.JOURNAL)}
              className="p-2 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
              title="Back to all entries"
            >
              <HiOutlineArrowLeft className="text-lg" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-[var(--text)] font-heading">
              {activeTab === 'editor'
                ? (entryId ? (isEditing ? 'Edit Reflection' : 'View Reflection') : 'Mindful Journal')
                : 'Saved Reflections'}
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              {activeTab === 'editor' ? 'A quiet space for your thoughts & feelings' : `${entries.length} reflections stored securely`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="clay-card p-1 rounded-2xl flex items-center gap-1 bg-[var(--bg-card)] border-2 border-[var(--border)]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${activeTab === 'editor'
                ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
            >
              <span className="flex items-center gap-1.5">
                <HiOutlinePencil /> {entryId && !isEditing ? 'View' : 'Write'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${activeTab === 'list'
                ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
            >
              <span className="flex items-center gap-1.5">
                <HiOutlineBookOpen /> All Entries
              </span>
            </button>
          </div>

          {activeTab === 'editor' && (
            <Button variant="secondary" size="sm" icon={<HiOutlinePlus />} onClick={handleCreateNew}>
              New
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'editor' ? (
          !isEditing && entryId ? (
            /* READ-ONLY VIEW MODE */
            <motion.div
              key="view-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Reading Canvas (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-6">
                  {/* Header Row */}
                  <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-4">
                    <span className="text-xs font-black text-[var(--cta)] bg-[var(--bg-cream)] px-3 py-1.5 rounded-xl border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--border)]">
                      📅 {formatDateFull(date)}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-cream)] px-3 py-1.5 rounded-xl border-2 border-[var(--border)]">
                        Read-Only View
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
                      >
                        <HiOutlinePencil /> Edit Entry
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text)]">
                    {title || 'Untitled Reflection'}
                  </h1>

                  {/* Formatted Content View */}
                  <div className="journal-quill-editor journal-readonly">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      readOnly={true}
                      modules={{ toolbar: false }}
                    />
                  </div>

                  {/* Metrics & Delete Row */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--border)] text-xs text-[var(--text-muted)] font-black">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <HiOutlineDocumentText className="text-[var(--text)]" />
                        {words} words
                      </span>
                      <span>{chars} characters</span>
                    </div>

                    {entryId && (
                      <button
                        onClick={() => handleDelete(entryId)}
                        className="flex items-center gap-1 text-[var(--cta)] font-black hover:underline cursor-pointer"
                      >
                        <HiOutlineTrash /> Delete Entry
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Side Info Inspector (1 Col) */}
              <div className="space-y-6">
                <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Logged Mood
                  </h3>
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center text-xl shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                      style={{ backgroundColor: getMoodOption(mood).color }}
                    >
                      {getMoodOption(mood).emoji}
                    </span>
                    <span className="text-base font-black text-[var(--text)]">
                      {getMoodOption(mood).label}
                    </span>
                  </div>
                </div>

                {tags && tags.length > 0 && (
                  <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-xl bg-[var(--bg-cream)] text-xs font-extrabold text-[var(--text)] border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--border)]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* EDIT MODE */
            <motion.div
              key="editor-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Writing Canvas (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="clay-card p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-6 relative">
                  {/* Save Status Row */}
                  <div className="flex items-center justify-between text-xs border-b-2 border-[var(--border)] pb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        max={todayStr}
                        value={date}
                        onChange={(e) => setDate(sanitizeDate(e.target.value))}
                        className="bg-[var(--bg-cream)] text-[var(--text)] px-3 py-1.5 rounded-xl font-bold border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                      />
                      <span className="text-[var(--text-muted)] font-bold hidden sm:inline">
                        ({formatDateFull(date)})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {saveStatus === 'saving' && (
                        <span className="flex items-center gap-1.5 text-[var(--cta)] font-black">
                          <HiOutlineSave className="animate-spin" /> Saving...
                        </span>
                      )}
                      {saveStatus === 'saved' && (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-black">
                          <HiOutlineCheckCircle /> {lastSavedTime ? `Saved at ${lastSavedTime}` : 'All changes saved'}
                        </span>
                      )}
                      {saveStatus === 'unsaved' && (
                        <span className="text-amber-500 font-black">Unsaved changes</span>
                      )}
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saveStatus === 'saved' || saveStatus === 'saving' || (!title.trim() && !content.trim())}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 border-[var(--border)] transition-all cursor-pointer ${saveStatus === 'unsaved'
                          ? 'bg-[var(--cta)] text-white shadow-[2px_2px_0px_0px_var(--border)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--border)]'
                          : 'bg-[var(--bg-cream)] text-[var(--text-muted)] opacity-60 cursor-not-allowed'
                          }`}
                      >
                        <HiOutlineSave /> Save
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of your reflection..."
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black font-heading text-[var(--text)] placeholder-slate-400 focus:outline-none border-b-3 border-transparent focus:border-[var(--border)] pb-2 transition-colors"
                  />

                  {/* Rich Text Editor */}
                  <div className="journal-quill-editor">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="What is on your mind today? Write freely without judgment..."
                    />
                  </div>

                  {/* Metrics & Delete Row */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--border)] text-xs text-[var(--text-muted)] font-black">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <HiOutlineDocumentText className="text-[var(--text)]" />
                        {words} words
                      </span>
                      <span>{chars} characters</span>
                    </div>

                    {entryId && (
                      <button
                        onClick={() => handleDelete(entryId)}
                        className="flex items-center gap-1 text-[var(--cta)] font-black hover:underline cursor-pointer"
                      >
                        <HiOutlineTrash /> Delete Entry
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Side Options Inspector (1 Col) */}
              <div className="space-y-6">
                <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
                  <h3 className="text-sm font-black text-[var(--text)] font-heading">
                    How are you feeling in this entry?
                  </h3>
                  <MoodSelector
                    selectedMood={mood}
                    onSelectMood={(m) => setMood(m)}
                    size="sm"
                    showLabels={false}
                  />
                </div>

                <div className="clay-card p-6 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] space-y-4">
                  <h3 className="text-sm font-black text-[var(--text)] font-heading">
                    Tags
                  </h3>
                  <TagInput tags={tags} onChangeTags={setTags} />
                </div>
              </div>
            </motion.div>
          )
        ) : (
          /* List View Tab */
          <motion.div
            key="list-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="clay-card p-4 rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border)] flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="relative w-full sm:w-80">
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, tags..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[var(--bg-cream)] text-xs font-bold text-[var(--text)] border-2 border-[var(--border)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[2px_2px_0px_0px_var(--border)]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-black shrink-0">
                  <HiOutlineFilter className="text-base text-[var(--cta)]" /> Filter Mood:
                </label>
                <select
                  value={selectedMoodFilter}
                  onChange={(e) => setSelectedMoodFilter(e.target.value)}
                  className="bg-[var(--bg-cream)] text-[var(--text)] text-xs font-black px-3.5 py-2 rounded-2xl border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)] focus:outline-none cursor-pointer"
                >
                  <option value="all">🌟 All Moods</option>
                  {MOOD_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No journal entries found"
                description="Try adjusting your search query or filter settings."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <JournalCard key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

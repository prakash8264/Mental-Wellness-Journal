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
  HiOutlineClock,
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
import { calculateWordAndCharCount } from '@/utils/moodUtils';
import { getTodayDateString, formatDateFull } from '@/utils/dateUtils';
import { MoodType, JournalEntry } from '@/types';
import { ROUTES } from '@/constants/routes';

// Strip HTML tags to get plain text for word/char counting
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

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

  const [activeTab, setActiveTab] = useState<'editor' | 'list'>(id ? 'editor' : 'editor');

  const [entryId, setEntryId] = useState<string | undefined>(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(dateParam || getTodayDateString());
  const [mood, setMood] = useState<MoodType>(todayMood?.mood || 'calm');
  const [tags, setTags] = useState<string[]>([]);

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');



  useEffect(() => {
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
      }
    } else {
      setEntryId(undefined);
      setTitle('');
      setContent('');
      setDate(dateParam || getTodayDateString());
      setMood(todayMood?.mood || 'calm');
      setTags([]);
    }
  }, [id, dateParam, getEntryById, todayMood]);

  const plainText = stripHtml(content);
  const { words, chars, readingTime } = calculateWordAndCharCount(plainText);

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
    setActiveTab('editor');
  };

  const handleDelete = (targetId: string) => {
    deleteEntry(targetId);
    if (targetId === entryId) {
      handleCreateNew();
    }
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
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
              title="Back to new entry"
            >
              <HiOutlineArrowLeft className="text-lg" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-[var(--text)] font-heading">
              {activeTab === 'editor' ? (entryId ? 'Edit Reflection' : 'Mindful Journal') : 'Saved Reflections'}
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
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${
                activeTab === 'editor'
                  ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HiOutlinePencil /> Write
              </span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer border-2 transition-all ${
                activeTab === 'list'
                  ? 'bg-[var(--primary)] text-[var(--text)] border-[var(--border)] shadow-[2px_2px_0px_0px_var(--border)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HiOutlineBookOpen /> All Entries ({entries.length})
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
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 border-[var(--border)] transition-all cursor-pointer ${
                        saveStatus === 'unsaved'
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
                    <span className="flex items-center gap-1 hidden sm:inline-flex">
                      <HiOutlineClock className="text-[var(--text)]" />
                      {readingTime} min read
                    </span>
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
                  Categorize & Tag
                </h3>
                <TagInput tags={tags} onChangeTags={setTags} />
              </div>
            </div>
          </motion.div>
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
                  placeholder="Search titles, text, tags..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[var(--bg-cream)] text-xs font-bold text-[var(--text)] border-2 border-[var(--border)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-[2px_2px_0px_0px_var(--border)]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-black">
                  <HiOutlineFilter /> Mood:
                </span>
                <button
                  onClick={() => setSelectedMoodFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-[var(--border)] cursor-pointer ${
                    selectedMoodFilter === 'all'
                      ? 'bg-[var(--primary)] text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)]'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                  }`}
                >
                  All
                </button>
                {['calm', 'happy', 'excited', 'sad', 'stressed'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMoodFilter(m)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-[var(--border)] capitalize cursor-pointer ${
                      selectedMoodFilter === m
                        ? 'bg-[var(--primary)] text-[var(--text)] shadow-[2px_2px_0px_0px_var(--border)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No journal entries found"
                description="Try adjusting your search query or filter settings, or start a new reflection."
                actionLabel="Write New Entry"
                onAction={handleCreateNew}
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

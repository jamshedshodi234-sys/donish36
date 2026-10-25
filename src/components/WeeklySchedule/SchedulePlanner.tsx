import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { ScheduleItem } from '../../types';
import { Calendar, Plus, Trash2, Printer, Clock, MapPin, BookOpen } from 'lucide-react';

const DAYS = ['Душанбе', 'Сешанбе', 'Чоршанбе', 'Панҷшанбе', 'Ҷумъа', 'Шанбе'];

export const SchedulePlanner: React.FC = () => {
  const { weeklySchedule, setWeeklySchedule } = useApp();

  const [selectedDay, setSelectedDay] = useState('Душанбе');
  const [lessonNumber, setLessonNumber] = useState(1);
  const [subject, setSubject] = useState('Алгебра');
  const [grade, setGrade] = useState('Синфи 8');
  const [room, setRoom] = useState('204');
  const [time, setTime] = useState('08:00 - 08:45');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ScheduleItem = {
      id: `sched-${Date.now()}`,
      dayOfWeek: selectedDay,
      lessonNumber,
      subject,
      grade,
      room,
      time,
    };

    setWeeklySchedule((prev) => [...prev, newItem]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setWeeklySchedule((prev) => prev.filter((item) => item.id !== id));
  };

  const dayLessons = weeklySchedule
    .filter((item) => item.dayOfWeek === selectedDay)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Банақшагирии таълимӣ</span>
            <span aria-hidden="true">·</span>
            <span>Ҷадвали ҳафтаина</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
            Ҷадвали дарсҳои мактабӣ
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Танзими дарсҳо барои рӯзҳои Душанбе то Шанбе бо синфхона ва замони дарс.
          </p>
        </div>

        <div className="flex gap-2 self-end sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Чоп кардан
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Иловаи дарс
          </button>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl no-print">
        {DAYS.map((d) => {
          const count = weeklySchedule.filter((item) => item.dayOfWeek === d).length;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
                selectedDay === d
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{d}</span>
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Timetable List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Рӯзи {selectedDay} — {dayLessons.length} дарс ба нақша гирифта шудааст
          </h3>
          <span className="text-xs text-slate-400 font-medium no-print">
            Барои соли таҳсили 2026-2027
          </span>
        </div>

        {dayLessons.length > 0 ? (
          <div className="space-y-3">
            {dayLessons.map((l) => (
              <div
                key={l.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-4 transition hover:border-blue-400"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    {l.lessonNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {l.subject}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{l.grade}</span>
                      {l.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {l.time}
                        </span>
                      )}
                      {l.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Синфхонаи {l.room}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(l.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition no-print"
                  title="Нест кардан"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm">Барои ин рӯз дарс ба қайд гирифта нашудааст.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              + Иловаи аввалин дарс
            </button>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Иловаи дарси нав ба ҷадвал
            </h3>

            <form onSubmit={handleAddLesson} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Рӯзи ҳафта
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Соати дарс (рақамаш)
                  </label>
                  <select
                    value={lessonNumber}
                    onChange={(e) => setLessonNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        Дарси {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Фанни таълимӣ
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {SCHOOL_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.nameTg}>
                      {s.nameTg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Синф
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Синфхона
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="204"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Вақти дарс
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="08:00 - 08:45"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Бекор кардан
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Сабти дарс
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

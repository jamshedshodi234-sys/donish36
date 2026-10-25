import React, { useState } from 'react';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { generateWithAI } from '../../services/api';
import { FileStack, Sparkles, Copy, Check, Printer, Download, AlertCircle, FileSpreadsheet } from 'lucide-react';

type MaterialType =
  | 'synopsis'
  | 'lecture'
  | 'presentation'
  | 'worksheet'
  | 'independent_work'
  | 'dictation'
  | 'comparative_table'
  | 'differentiated';

export const MaterialsGenerator: React.FC = () => {
  const [subject, setSubject] = useState('Забони тоҷикӣ');
  const [grade, setGrade] = useState('Синфи 7');
  const [topic, setTopic] = useState('Ҷумлаҳои мураккаби пайваст ва тобеъ');
  const [materialType, setMaterialType] = useState<MaterialType>('synopsis');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const materialTypesConfig: { id: MaterialType; label: string; desc: string }[] = [
    { id: 'synopsis', label: 'Конспекти дарс', desc: 'Мазмуни мукаммали назариявии мавзӯъ' },
    { id: 'lecture', label: 'Маърӯзаи омӯзгор', desc: 'Матни суханронии илмӣ ва фаҳмо барои дарс' },
    { id: 'presentation', label: 'Презентатсияи сохторӣ', desc: 'Слайд ба слайд бо матн ва саволҳо' },
    { id: 'worksheet', label: 'Варақаи супоришҳо', desc: 'Супоришҳо барои кори амалӣ ва гурӯҳӣ' },
    { id: 'independent_work', label: 'Кори мустақилона', desc: 'Вариантҳои кори хаттӣ бо меъёрҳо' },
    { id: 'dictation', label: 'Матни диктант', desc: 'Матни адабӣ бо мақсади санҷиши имло' },
    { id: 'comparative_table', label: 'Ҷадвали муқоисавӣ', desc: 'Муқоисаи мафҳумҳо, формулаҳо ва қоидаҳо' },
    { id: 'differentiated', label: 'Машқҳои тафриқавӣ', desc: 'Барои хонандагони сустхон ва болаёқат' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Мавзӯъро ворид кунед.');
      return;
    }

    setError('');
    setIsLoading(true);

    const typeLabel = materialTypesConfig.find((m) => m.id === materialType)?.label || 'Маводи таълимӣ';

    const prompt = `Шумо бояд маводи таълимии зеринро барои мактабҳои таҳсилоти умумии Тоҷикистон таҳия намоед:

НАМУДИ МАВОД: ${typeLabel}
ФАН: ${subject}
СИНФ: ${grade}
МАВЗӮЪ: ${topic}

ТАЛАБОТ:
1. Мавод бояд пурра, мукаммал ва аз ҷиҳати методӣ саҳеҳ бошад.
2. Агар презентатсия бошад: Слайд 1, Слайд 2 ва ғайра бо сарлавҳа, нуктаҳои калидӣ ва тавзеҳи муаллим.
3. Агар ҷадвали муқоисавӣ бошад: дар шакли ҷадвали матнӣ (Markdown table) мураттаб шавад.
4. Агар кори мустақилона ё варақа бошад: Варианти 1 ва Варианти 2 бо дастури баҳодиҳӣ пешниҳод гардад.
5. Агар машқҳои тафриқавӣ бошад: Қисми А (барои мустаҳкамкунии пояи дониш) ва Қисми Б (барои хонандагони пешқадам ва олимпиадаҳо).
6. Забон: Тоҷикии адабӣ ва саҳеҳ.`;

    const res = await generateWithAI({
      prompt,
      systemInstruction: 'Шумо мутахассиси омодасозии маводи таълимӣ ва китобҳои дарсии Тоҷикистон ҳастед.',
    });

    setIsLoading(false);
    if (res.success && res.text) {
      setResult(res.text);
    } else {
      setError(res.error || 'Хатогӣ ҳангоми омодасозии мавод.');
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Маводи таълимӣ ва дидактикӣ
            </h3>
            <p className="text-xs text-slate-500">
              Конспект, маърӯза, презентатсия ва машқҳои тафриқавӣ
            </p>
          </div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            Интихоби намуди мавод
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {materialTypesConfig.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMaterialType(item.id)}
                className={`text-left p-2.5 rounded-xl border transition ${
                  materialType === item.id
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="text-xs">{item.label}</div>
              </button>
            ))}
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
              Мавзӯъ
            </label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Зеҳни сунъӣ таҳия карда истодааст...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Таҳияи мавод бо AI</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Маводи таҳияшуда
            </h4>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Нусха шуд' : 'Нусха'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Чоп
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <p className="text-xs text-slate-500">Мавод мутобиқи барномаи таълимӣ тартиб дода мешавад...</p>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 max-h-[600px] overflow-y-auto">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
                <FileStack className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">Намуди мавод ва мавзӯъро интихоб кунед.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

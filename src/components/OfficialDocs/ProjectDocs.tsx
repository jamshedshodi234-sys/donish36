import React, { useState } from 'react';
import {
  FileText,
  Award,
  HelpCircle,
  Download,
  Printer,
  Copy,
  Check,
  BookOpen,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProjectDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'official' | 'defense' | 'questions' | 'install'>('official');
  const [copied, setCopied] = useState(false);

  const handleCopyCurrent = () => {
    const el = document.getElementById('docs-printable-area');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Editorial Academic Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-blue-700 dark:text-blue-400 font-bold">Озмуни ҷумҳуриявӣ</span>
            <span aria-hidden="true">·</span>
            <span>«Идеяи ман — калиди фардо»</span>
            <span aria-hidden="true">·</span>
            <span>Муаллиф: Ярахмадов Аличон (Синфи 11 г МТМУ №36)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
            Ҳуҷҷатҳои расмӣ ва ҳимояи лоиҳа
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Папкаи расмии 23-бахшаи илмӣ, матни ҳимояи 5–7 дақиқаӣ ва 15 саволу ҷавоби ҳакамон.
          </p>
        </div>

          <div className="flex items-center gap-2 no-print self-end sm:self-auto">
            <button
              onClick={handleCopyCurrent}
              className="p-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Нусха шуд' : 'Нусхабардорӣ'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-500/30"
            >
              <Printer className="w-3.5 h-3.5" /> Чопи расмӣ
            </button>
          </div>
        </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl no-print">
        <button
          onClick={() => setActiveTab('official')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'official'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ҳуҷҷати расмии лоиҳа (23 бахш)</span>
        </button>

        <button
          onClick={() => setActiveTab('defense')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'defense'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Матни ҳимоя (5–7 дақиқа)</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <span>15 саволу ҷавоби ҳакамон</span>
        </button>

        <button
          onClick={() => setActiveTab('install')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'install'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Дастури насб ва истифода</span>
        </button>
      </div>

      {/* Document Area */}
      <div
        id="docs-printable-area"
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
      >
        {activeTab === 'official' && (
          <article className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                ОЗМУНИ ҶУМҲУРИЯВИИ «ИДЕЯИ МАН — КАЛИДИ ФАРДО»
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                ҲУҶҶАТИ РАСМИИ ЛОИҲАИ ИЛМӢ-ИННОВАТСИОНӢ
              </h1>
              <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                «Омӯзгори ҳушманд — AI Ёвар» (Smart Teacher — AI Assistant)
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">1</span>
                Номи пурраи лоиҳа
              </h3>
              <p className="text-sm">
                <strong>Номи тоҷикӣ:</strong> «Омӯзгори ҳушманд — AI Ёвар»
                <br />
                <strong>Номи байналмилалӣ (англисӣ):</strong> Smart Teacher — AI Assistant
                <br />
                <strong>Самти тадқиқот:</strong> Зеҳни сунъӣ, технологияҳои иттилоотӣ, рақамикунонии соҳаи маориф ва омӯзиши фардӣ.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">2</span>
                Маълумот дар бораи муаллиф ва роҳбар
              </h3>
              <p className="text-sm">
                <strong>Муаллифи лоиҳа:</strong> Ярахмадов Аличон, хонандаи синфи 11 «г»-и Муассисаи таҳсилоти миёнаи умумии №36-и ноҳияи Шоҳмансури шаҳри Душанбе.
                <br />
                <strong>Муассисаи пешниҳодкунанда:</strong> МТМУ №36-и ноҳияи Шоҳмансур.
                <br />
                <strong>Забони асосии система:</strong> Тоҷикӣ (бо имконияти гузариш ба русӣ ва англисӣ).
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">3</span>
                Аннотатсия (Хулосаи мухтасар)
              </h3>
              <p className="text-sm">
                Лоиҳаи мазкур ба таҳия ва ҷорисозии як платформаи амалкунанда ва муосири зеҳни сунъӣ барои низоми таҳсилоти миёнаи умумии Ҷумҳурии Тоҷикистон бахшида шудааст. Барнома бар пояи технологияи пешрафтаи Gemini API сохта шуда, бо таҳлили амиқи методикаи миллии таълим барои омӯзгорон (таҳияи худкори нақшаи дарс бо 14 марҳила, сохтани тестҳои 4-варианта, саволҳои шифоҳӣ ва арзёбии ҷавобҳо) ва хонандагон (тавзеҳи қадам ба қадами масъалаҳои риёзӣ, физикӣ, химия ва забону адабиёт) хизмат мерасонад. Маҳсулот дар меъмории мукаммали клиент-серверӣ (React + Node.js Express) бо ҳифзи пурраи калидҳои махфӣ амалӣ гаштааст.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">4</span>
                Муқаддима
              </h3>
              <p className="text-sm">
                Дар Паёми ҳамасолаи Асосгузори сулҳу ваҳдати миллӣ — Пешвои миллат, Президенти Ҷумҳурии Тоҷикистон муҳтарам Эмомалӣ Раҳмон рушди илмҳои табиатшиносӣ, дақиқ ва риёзӣ, инчунин ҷорӣ намудани технологияҳои рақамӣ дар соҳаи маориф вазифаи стратегӣ эълон шудааст. Бо дарназардошти ин сиёсат, истифодаи зеҳни сунъӣ метавонад самаранокии меҳнати омӯзгоронро баланд бардошта, ба хонандагон новобаста аз макони зисташон имкони дастрасӣ ба ёвари шахсии донишро фароҳам оварад.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">5</span>
                Мубрамияти мавзӯъ (Актуалност)
              </h3>
              <p className="text-sm">
                Мубрамияти лоиҳа дар он зоҳир мегардад, ки аксари омӯзгорон соатҳои зиёди вақти худро сарфи корҳои такроршаванда ва қоғазбозӣ — омода кардани нақшаҳои дарсӣ, навиштани конспектҳо, тартиб додани тестҳо ва саволҳо мекунанд. Аз сӯйи дигар, на ҳамаи хонандагон имкони дастрасӣ ба омӯзгори инфиродӣ ё репетиторро доранд. «Омӯзгори ҳушманд» ин фосиларо пур карда, ба як воситаи дастрас ва миллии ёрирасон табдил меёбад.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">6</span>
                Масъалаи мавҷуда
              </h3>
              <p className="text-sm">
                1. Сарбории зиёди омӯзгорон бо корҳои коғазӣ ва омодасозии дастӣ;
                <br />
                2. Набудани абзорҳои махсусгардонидашудаи зеҳни сунъӣ ба забони тоҷикӣ, ки стандарти таълимии мактабҳои кишварро донанд;
                <br />
                3. Мушкилии хонандагон дар дарки масъалаҳои мураккаби формулавии математика, физика ва химия ҳангоми иҷрои вазифаи мустақилона.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">7</span>
                Ҳадафи асосии лоиҳа
              </h3>
              <p className="text-sm">
                Эҷоди як экосистемаи рақамии мукаммал ва амалкунанда дар заминаи зеҳни сунъии муосир барои дастгирии фаъолияти педагогии омӯзгорон ва баланд бардоштани сатҳи донишу маҳорати хонандагони мактабҳои Тоҷикистон ба забони модарӣ.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">8</span>
                Вазифаҳои лоиҳа
              </h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Таҳқиқ ва таҳлили талаботи стандарти давлатии таҳсилот ва сохтори нақшаи дарсҳо;</li>
                <li>Тарҳрезӣ ва татбиқи меъмории бехатари серверӣ бо пайвасти расмии Gemini API;</li>
                <li>Сохтани модулҳои худкори методӣ: генератори нақшаи дарс, санҷишҳо, саволҳои шифоҳӣ ва маводи таълимӣ;</li>
                <li>Таҳияи модули интерактивии супоридани тест ва ҳисоби фаврии баҳо бо шарҳи хатогиҳо;</li>
                <li>Мутобиқсозии пурраи интерфейс ба забони тоҷикӣ ва дастгирии телефонҳои мобилӣ;</li>
                <li>Санҷиши бехатарӣ ва муҳофизати маълумоти корбарон.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">9</span>
                Навоварии илмӣ ва амалии лоиҳа
              </h3>
              <p className="text-sm">
                Ин аввалин платформаи мукаммали таълимӣ дар Тоҷикистон мебошад, ки алгоритми пешрафтаи генеративии Gemini-ро бо стандарти мактабии кишвар мутобиқ намудааст. Баръакси чатботҳои оддии тарҷумавӣ, ин система қоидаҳои педагогика (мақсади таълимӣ, тарбиявӣ, инкишофдиҳанда ва 14 марҳилаи дарс)-ро медонад ва барои 20 фанни дарсӣ қолаби махсуси дидактикӣ тавлид мекунад.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">10</span>
                Объект ва предмети таҳқиқот
              </h3>
              <p className="text-sm">
                <strong>Объекти таҳқиқот:</strong> Ҷараёни таълиму тарбия ва тайёрӣ ба дарс дар муассисаҳои таҳсилоти миёнаи умумӣ.
                <br />
                <strong>Предмети таҳқиқот:</strong> Истифодаи моделҳои бузурги забонии зеҳни сунъӣ (LLM) ва барномасозии веб барои худкоркунонии раванди омодасозии маводи дидактикӣ.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">11-14</span>
                Усулҳои татбиқ, технологияҳо ва бехатарӣ
              </h3>
              <p className="text-sm">
                <strong>Стек:</strong> React 19, TypeScript, Tailwind CSS, Express, Node.js, @google/genai SDK (Модели gemini-3.8-flash).
                <br />
                <strong>Бехатарӣ:</strong> Калиди GEMINI_API_KEY танҳо дар муҳити сервер маҳфуз буда, ҳеҷ гоҳ ба браузер намерасад.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">15-18</span>
                Самаранокии таълимӣ ва натиҷаҳои интизоршаванда
              </h3>
              <p className="text-sm">
                Сарфаи то 60-70% вақти омӯзгор дар таҳияи ҳуҷҷатҳо, беҳтар шудани сифати санҷиши дониш тавассути таҳлили худкори хатогиҳо ва баланд гардидани завқи хонандагон ба омӯзиши илмҳои дақиқ.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">19-23</span>
                Хароҷот, хатарҳо, нақшаи рушд ва хулоса
              </h3>
              <p className="text-sm">
                Дар марҳилаи кунунӣ хароҷоти ибтидоӣ ҳадди ақал аст (Google Cloud Run / Free Tier). Хатарҳои эҳтимолии таҳрифи маълумот бо огоҳиномаҳои методӣ маҳдуд карда шудаанд (омӯзгор қабулкунандаи ниҳоист).
                <br />
                <strong>Нақшаи оянда:</strong> Таҳияи замимаи мобилии насбшаванда (Android/iOS), пайваст кардани китобхонаи электронии китобҳои дарсии тоҷикӣ ва омодасозии овозии ҷавобҳо.
              </p>
            </section>
          </article>
        )}

        {activeTab === 'defense' && (
          <article className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                РЕГЛАМЕНТИ СУХАНРОНӢ: 5–7 ДАҚИҚА
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Матни суханронии ҳимояи лоиҳа дар назди ҳайати ҳакамон
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                <strong className="block text-blue-800 dark:text-blue-300 mb-1">
                  1. Салом ва муаррифӣ (1 дақиқа):
                </strong>
                «Ассалому алайкум ва раҳматуллоҳи ва баракотуҳу, аъзои муҳтарами ҳакамон ва ҳозирини гиромӣ!
                Номи ман Ярахмадов Аличон, хонандаи синфи 11 «г»-и муассисаи таҳсилоти миёнаи умумии рақами 36-и ноҳияи Шоҳмансури шаҳри Душанбе мебошам.
                Имрӯз дар озмуни ҷумҳуриявии «Идеяи ман — калиди фардо» бо камоли ифтихор лоиҳаи инноватсионии худ — «Омӯзгори ҳушманд — AI Ёвар» (Smart Teacher)-ро муаррифӣ менамоям.»
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">
                  2. Сабаби интихоби мавзӯъ ва мушкилоти мавҷуда (1.5 дақиқа):
                </strong>
                «Дар замони рушди босуръати технологияҳои рақамӣ ва зеҳни сунъӣ, маорифи мо низ ба воситаҳои муосир ниёз дорад. Омӯзгорони мо шабонарӯзӣ соатҳои зиёдро сарфи таҳияи дастнависҳои нақшаи дарс, конспектҳо ва тестҳо мекунанд. Хонандагон бошанд, ҳангоми дучор шудан ба масъалаҳои мураккаби риёзӣ ё формулаҳои физика аксар вақт бе ёрирасон мемонанд. Маҳз барои ҳалли ин масъала ман ин барномаи воқеиро офаридам.»
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
                <strong className="block text-emerald-800 dark:text-emerald-300 mb-1">
                  3. Моҳият ва намоиши амалии барнома (2.5 дақиқа):
                </strong>
                «Лоиҳаи ман макети оддӣ ё сурати хушку холӣ нест. Ин барномаи комилан коркунанда мебошад, ки ба модели воқеии зеҳни сунъии Gemini API пайваст аст.
                Иҷозат диҳед сенарияро нишон диҳам:
                Аввал омӯзгор ба бахши "Нақшаи дарс" медарояд, фанни Алгебра, синфи 8 ва мавзӯи "Муодилаҳои квадратӣ"-ро интихоб мекунад. Бо пахши як тугма, Gemini API нақшаи пурраи 14-марҳиларо омода мекунад.
                Баъдан, бо як клик 5 саволи тестӣ тавлид мешавад. Хонанда метавонад ҳамин ҷо тест супорад ва зеҳни сунъӣ фавран баҳоро ҳисоб карда, хатогиҳояшро шарҳ медиҳад!»
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40">
                <strong className="block text-purple-800 dark:text-purple-300 mb-1">
                  4. Хулоса ва ташаккур (1 дақиқа):
                </strong>
                «Ҳадафи ман фароҳам овардани муҳити баробари таълимӣ барои тамоми хонандагону омӯзгорони Тоҷикистон мебошад. Технологияи мазкур метавонад дар ҳамаи мактабҳои кишвар татбиқ гардад.
                Ташаккур барои таваҷҷуҳатон! Ба саволҳои Шумо бо камоли майл ҷавоб медиҳам.»
              </div>
            </div>
          </article>
        )}

        {activeTab === 'questions' && (
          <article className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                ОМОДАГӢ БА САВОЛҲОИ САНҶИШӢ
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                15 саволи эҳтимолии ҳакамон ва ҷавобҳои асосноки муаллиф
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {[
                {
                  q: '1. Лоиҳаи Шумо аз ChatGPT ё чатботҳои маъмулӣ чӣ фарқ дорад?',
                  a: 'Чатботҳои умумӣ сохтори методии мактабии Тоҷикистонро надоранд. «Омӯзгори ҳушманд» махсус барои барномаи таълимии кишвар тарҳрезӣ шуда, қолаби расмии нақшаи дарсӣ (14 банд), саволҳои 4-вариантаи ММТ, сатҳбандии шифоҳӣ ва шарҳи қадам ба қадами риёзиро ба таври худкор ва сохторбандӣ содир мекунад.',
                },
                {
                  q: '2. Оё ҷавобҳои зеҳни сунъӣ ҳамеша дурустанд? Агар хато кунад чӣ?',
                  a: 'Дар педагогика қарори ниҳоӣ ҳамеша ба омӯзгор тааллуқ дорад. Барнома маводи тавсиявӣ пешниҳод мекунад ва дар интерфейс равшан қайд шудааст, ки омӯзгор маводро пеш аз дарс аз назар гузаронад. Ҳамчунин бо танзими ҳарорати (temperature: 0.4 - 0.6) модел, дақиқии илмӣ ба ҳадди аксар расонида шудааст.',
                },
                {
                  q: '3. Калиди Gemini API ва амнияти барнома чӣ гуна таъмин шудааст?',
                  a: 'Ин барнома меъмории мукаммали Client-Server дорад. Калиди API танҳо дар файли махфии сервери Node.js нигоҳ дошта шуда, ҳеҷ гоҳ ба коди клиентӣ ё браузери истифодабаранда намерасад.',
                },
                {
                  q: '4. Барои истифодаи ин платформа дар мактабҳо чӣ қадар хароҷот лозим аст?',
                  a: 'Барои марҳилаи аввал хароҷот қариб сифр аст, зеро аз квотаи бепули Gemini API ва сервери абрӣ истифода мешавад. Дар сурати пайвастшавии тамоми ҷумҳурӣ, хароҷоти серверӣ хеле кам буда, нисбат ба чопи миллионҳо китобу варақаҳои коғазӣ садҳо баробар сарфакоронатар аст.',
                },
                {
                  q: '5. Чаро телефонҳои тоҷикии +992-ро дар бақайдгирӣ талаб мекунед?',
                  a: 'Зеро ҳадафи мо таҳияи маҳсулоти миллии Тоҷикистон мебошад. Ин имкон медиҳад, ки омӯзгорон ва хонандагони мактабҳои кишвар бо шахсияти воқеии худ ва рақами муътабар ворид шуда, баъдан ба низоми баҳогузории расмӣ пайваст шаванд.',
                },
                {
                  q: '6. Оё ин барнома дар телефони оддӣ ҳам кор мекунад?',
                  a: 'Бале! Интерфейс бо технологияи мутобиқшаванда (Responsive Design) сохта шудааст ва дар ҳама гуна экран — телефонҳои Android, iPhone ва компютерҳо бе мушкилӣ ва тез кор мекунад.',
                },
                {
                  q: '7. Оё нақшаи дарсро метавон чоп ё боргирӣ кард?',
                  a: 'Бале, барнома тугмаи махсуси «Чоп» бо қолаби расмии Вазорати маориф ва тугмаи боргирии файли матнии TXT-ро дорад.',
                },
                {
                  q: '8. Хонанда чӣ гуна метавонад масъалаи математикиро ҳал кунад?',
                  a: 'Дар бахши «Ёвари хонанда» зеҳни сунъӣ на танҳо ҷавоби тайёр, балки тамоми формулаҳо, дискриминант, қоидаҳои Виет ва сабаби интихоби ҳар як қадамро ба таври сода шарҳ медиҳад.',
                },
                {
                  q: '9. Оё имкони илова кардани дигар фанҳо вуҷуд дорад?',
                  a: 'Бале, дар барнома рӯйхати 20 фанни асосӣ мавҷуд аст ва ҳамчунин интихоби «Дигар фанҳо» пешбинӣ шудааст, ки истифодабаранда метавонад фанни дилхоҳро нависад.',
                },
                {
                  q: '10. Нақши Шумо ҳамчун хонандаи синфи 11 дар ин лоиҳа чӣ гуна буд?',
                  a: 'Ман тамоми сохтори барнома, идеяи методии омӯзгорӣ, тарҳрезии интерфейс, логикаи санҷиши тестҳо, пайвасткунии Gemini API ва коди мукаммали TypeScript-ро мустақилона тарҳрезӣ ва таҳия намудам.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {item.q}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </article>
        )}

        {activeTab === 'install' && (
          <article className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                ДАСТУРИ ТЕХНИКӢ ВА НАСБ
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Дастури қадам ба қадами насб, иҷро ва нашри барнома
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-2">
                  1. Иҷрои лоиҳа дар муҳити маҳаллӣ (компютер)
                </h4>
                <ol className="list-decimal list-inside space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <li>Файли ZIP-ро кушоед ва ба папкаи лоиҳа ворид шавед.</li>
                  <li>Фармони <code>npm install</code> -ро иҷро кунед.</li>
                  <li>Файли <code>.env</code> созед ва калиди <code>GEMINI_API_KEY="..."</code>-ро гузоред.</li>
                  <li>Фармони <code>npm run dev</code> -ро пахш намоед.</li>
                  <li>Дар браузер суроғаи <code>http://localhost:3000</code> -ро боз кунед.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-2">
                  2. Нашри барнома дар Google Cloud Run
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Лоиҳа бо фармони <code>npm run build</code> омода гашта, сервери Node.js дар порти 3000 тавассути контейнери Cloud Run мустақиман пахш мешавад. Калиди GEMINI_API_KEY дар қисми Environment Variables танзим мегардад.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-2">
                  3. Сохтани версияи компютерӣ (Desktop App)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ҳамчун марҳилаи дуюм, барнома метавонад ба воситаи китобхонаи <strong>Electron</strong> ё <strong>Tauri</strong> ҳамчун файли насбшавандаи Windows (.exe) бастабандӣ гардад, ки ба омӯзгорон имкони кор дар синфхонаҳои компютериро медиҳад.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/20">
                <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  4. Нашр дар GitHub Pages (Ҳалли саҳифаи сафед)
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                  <strong>Сабаби сафед шудани саҳифа:</strong> Папкаи асосии <code>main / (root)</code> коди хоми TypeScript дорад, ки браузер бе компилятсия онро хонда наметавонад. Бояд папкаи сохташудаи <code>dist/</code> нашр шавад.
                </p>
                <div className="space-y-1.5 font-mono text-xs text-slate-800 dark:text-slate-200">
                  <p className="font-sans font-semibold text-xs text-slate-900 dark:text-white">Усули автоматӣ (GitHub Actions):</p>
                  <p>1. Дар GitHub ба <strong>Settings ➔ Pages</strong> равед.</p>
                  <p>2. Дар майдони <strong>Source</strong> ба ҷои "Deploy from a branch", <strong>"GitHub Actions"</strong>-ро интихоб кунед.</p>
                  <p>3. Лоиҳа худкор файлҳои компилятсияшудаи <code>dist/</code>-ро бо файли <code>.github/workflows/deploy.yml</code> сохта нашр мекунад!</p>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

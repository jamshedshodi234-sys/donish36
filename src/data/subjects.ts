import { SubjectItem } from '../types';

export const SCHOOL_SUBJECTS: SubjectItem[] = [
  { id: 'tajik_lang', nameTg: 'Забони тоҷикӣ', nameRu: 'Таджикский язык', nameEn: 'Tajik Language', category: 'humanitarian', icon: 'BookOpen' },
  { id: 'tajik_lit', nameTg: 'Адабиёти тоҷик', nameRu: 'Таджикская литература', nameEn: 'Tajik Literature', category: 'humanitarian', icon: 'Feather' },
  { id: 'algebra', nameTg: 'Алгебра', nameRu: 'Алгебра', nameEn: 'Algebra', category: 'exact', icon: 'Calculator' },
  { id: 'geometry', nameTg: 'Геометрия', nameRu: 'Геометрия', nameEn: 'Geometry', category: 'exact', icon: 'Compass' },
  { id: 'math', nameTg: 'Математика', nameRu: 'Математика', nameEn: 'Mathematics', category: 'exact', icon: 'Hash' },
  { id: 'physics', nameTg: 'Физика', nameRu: 'Физика', nameEn: 'Physics', category: 'exact', icon: 'Zap' },
  { id: 'chemistry', nameTg: 'Химия', nameRu: 'Химия', nameEn: 'Chemistry', category: 'natural', icon: 'FlaskConical' },
  { id: 'biology', nameTg: 'Биология', nameRu: 'Биология', nameEn: 'Biology', category: 'natural', icon: 'Dna' },
  { id: 'informatics', nameTg: 'Информатика ва барномасозӣ', nameRu: 'Информатика и программирование', nameEn: 'Computer Science', category: 'exact', icon: 'Code' },
  { id: 'it', nameTg: 'Технологияи иттилоотӣ', nameRu: 'Информационные технологии', nameEn: 'Information Technology', category: 'exact', icon: 'Cpu' },
  { id: 'history', nameTg: 'Таърихи халқи тоҷик ва умумӣ', nameRu: 'История', nameEn: 'History', category: 'humanitarian', icon: 'Landmark' },
  { id: 'geography', nameTg: 'География', nameRu: 'География', nameEn: 'Geography', category: 'natural', icon: 'Globe' },
  { id: 'law', nameTg: 'Асосҳои давлат ва ҳуқуқ', nameRu: 'Основы государства и права', nameEn: 'Law and State', category: 'humanitarian', icon: 'Scale' },
  { id: 'russian', nameTg: 'Забони русӣ', nameRu: 'Русский язык', nameEn: 'Russian Language', category: 'humanitarian', icon: 'Languages' },
  { id: 'english', nameTg: 'Забони англисӣ', nameRu: 'Английский язык', nameEn: 'English Language', category: 'humanitarian', icon: 'Globe2' },
  { id: 'natural_science', nameTg: 'Табиатшиносӣ', nameRu: 'Естествознание', nameEn: 'Natural Science', category: 'natural', icon: 'Leaf' },
  { id: 'economics', nameTg: 'Иқтисод ва донишҳои молиявӣ', nameRu: 'Экономика и финансы', nameEn: 'Economics and Finance', category: 'humanitarian', icon: 'TrendingUp' },
  { id: 'pe', nameTg: 'Тарбияи ҷисмонӣ', nameRu: 'Физическая культура', nameEn: 'Physical Education', category: 'special', icon: 'Activity' },
  { id: 'art_music', nameTg: 'Санъат ва мусиқӣ', nameRu: 'Искусство и музыка', nameEn: 'Art and Music', category: 'special', icon: 'Music' },
  { id: 'other', nameTg: 'Дигар фанҳо (Интихоби озод)', nameRu: 'Другой предмет', nameEn: 'Other Subject', category: 'special', icon: 'PlusCircle' },
];

export const GRADES = [
  'Синфи 1', 'Синфи 2', 'Синфи 3', 'Синфи 4',
  'Синфи 5', 'Синфи 6', 'Синфи 7', 'Синфи 8',
  'Синфи 9', 'Синфи 10', 'Синфи 11',
  'Коллеҷ / Донишгоҳ'
];

export const DEMO_SCENARIOS = [
  {
    id: 'algebra_quad',
    title: 'Сенарияи асосӣ: Алгебра (Синфи 8)',
    subject: 'Алгебра',
    grade: 'Синфи 8',
    topic: 'Муодилаҳои квадратӣ ва теоремаи Виет',
    duration: '45 дақиқа',
    description: 'Омодасозии пурраи нақшаи дарс, маводи назариявӣ, машқҳои ҳисобӣ ва 5 саволи тестӣ бо шарҳи хатогиҳо барои озмуни ҷумҳуриявӣ.',
    demoMathProblem: 'Муодилаи квадратиро ҳал намоед: x² - 5x + 6 = 0 бо усули дискриминант ва теоремаи Виет.',
  },
  {
    id: 'physics_newton',
    title: 'Сенарияи илмӣ: Физика (Синфи 9)',
    subject: 'Физика',
    grade: 'Синфи 9',
    topic: 'Қонуни дуюми Нютон ва робитаи қувва бо шитоб',
    duration: '45 дақиқа',
    description: 'Шарҳи қонуни F = m * a бо мисолҳои ҳаётӣ, таҷрибаҳои намоишӣ ва масъалаҳои физикӣ бо ченакҳои СИ.',
    demoMathProblem: 'Ба ҷисми массааш 4 кг қувваи 20 Н таъсир мекунад. Шитоби ҷисмро муайян кунед.',
  },
  {
    id: 'tajik_lang_complex',
    title: 'Сенарияи забонӣ: Забони тоҷикӣ (Синфи 7)',
    subject: 'Забони тоҷикӣ',
    grade: 'Синфи 7',
    topic: 'Ҷумлаҳои мураккаби пайваст ва тобеъ',
    duration: '45 дақиқа',
    description: 'Қоидаҳои пайвандакҳо, аломатҳои китобат, таҳлили синтаксисӣ ва машқҳои амалӣ барои мустаҳкамкунӣ.',
    demoMathProblem: 'Ҷумлаи зеринро аз ҷиҳати синтаксисӣ таҳлил намуда, сарҷумла ва ҷумлаи пайравро муайян кунед: «Вақте ки баҳор фаро расид, дарахтон гул карданд».',
  },
  {
    id: 'it_ai_algorithms',
    title: 'Сенарияи инноватсионӣ: Технологияи иттилоотӣ (Синфи 10)',
    subject: 'Технологияи иттилоотӣ',
    grade: 'Синфи 10',
    topic: 'Асосҳои алгоритмсозӣ, додаҳо ва зеҳни сунъӣ',
    duration: '45 дақиқа',
    description: 'Мафҳуми алгоритм, барномасозӣ бо забони муосир ва нақши зеҳни сунъӣ дар маорифи рақамӣ.',
    demoMathProblem: 'Алгоритми пайдо кардани адади калонтарин дар байни се адади додашударо дар намуди блок-схема ё псевдокод шарҳ диҳед.',
  },
];

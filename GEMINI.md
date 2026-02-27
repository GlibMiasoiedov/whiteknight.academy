# White Knight Academy — Agent Rules

## Мова
- Спілкування з користувачем: **українська**
- Код, коментарі, git messages: **англійська**

## Проєкт
- **Тип**: React SPA (Vite + TypeScript)
- **Деплоймент**: FTP через `analytics-app/deploy.js`
- **URL**: https://analytics.whiteknight.academy
- **Стек**: React 19, Tailwind CSS v4, Lucide React icons
- **Charts**: Custom SVG — `RatingChart`, `RatingDynamicsChart`, `StatRoseChart`, `ActivityHeatmap`. Recharts НЕ використовується.

## Структура файлів
- Компоненти: `analytics-app/src/components/<domain>/`
- Домени: `layout/`, `report/widgets/`, `coaching/`, `landing/`, `modals/`, `ui/`, `shared/`, `onboarding/`, `pages/`, `dev/`
- Токени дизайну: `analytics-app/src/constants/theme.ts`
- Глобальний CSS: `analytics-app/src/index.css`
- Entry: `analytics-app/src/App.tsx` → `DashboardLayout.tsx`

## Code Style
- Компоненти: `PascalCase.tsx`, arrow function + `React.FC<Props>`
- Інтерфейси: `interface XxxProps {}` в тому ж файлі, зверху
- Imports порядок: React → Lucide icons → local components → constants → types
- Tailwind: inline classes, НЕ `@apply` (обмеження Tailwind v4)
- Class concatenation: template literals. Проєкт НЕ використовує `clsx`/`cn()`. Falsy-фільтрація: `${condition ? 'class-name' : ''}`
- Максимальний розмір компонента: **~300 рядків**. Якщо більше — розбий на sub-компоненти

## Критичні правила
1. **Tailwind class strings** — НІКОЛИ пробілів всередині класу. `w - full` = ПОМИЛКА, правильно: `w-full`
2. **z-index** — ЦІЛЬОВА ієрархія: version badge `z-10` → sidebar `z-40` → RightPanel `z-50` → modals `z-[60]` → critical overlays `z-[200]`. ⚠️ Поточний код має legacy значення (`MobileGate z-[99999]`, `GlobalDebug z-[9999]`, `OnboardingWizard z-[100]`, `FiltersDrawer z-[70]`). Мігрувати при нагоді.
3. **Icons** — тільки Lucide React. НІКОЛИ emoji в UI елементах
4. **Деплоймент** — `npm run build` → `node deploy.js`. Entry point: `index.php` → `app.html` + `vN.html` cache busting

## Перед UI-роботою
Перш ніж змінювати стилі, hover-ефекти або layout — **прочитай відповідний skill**:
- Кольори, шрифти, токени → `design-system`
- Картки, кнопки, таблиці → `component-patterns`
- Hover, glow, анімації → `hover-and-interactions`
- Breakpoints, responsive → `responsive-layout`

## Git
- Commit format: `feat:` / `fix:` / `refactor:` / `style:` prefix (англійська)
- Push на GitHub після кожного milestone

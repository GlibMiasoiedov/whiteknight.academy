# White Knight Academy - WordPress Theme

Цей репозиторій містить WordPress теми для сайту [whiteknight.academy](https://whiteknight.academy/).

## Структура

```
themes/
├── rook/           # Основна тема Rook
└── rook-child/     # Дочірня тема з кастомізаціями
```

## Робочий процес

1. **Редагування** - зміни вносяться через Antigravity
2. **Commit + Push** - автоматично синхронізується з GitHub
3. **Deploy** - завантаження на сервер через FTP

## FTP Деплой

Файли завантажуються на сервер за адресою:
- `ftp://45.84.204.95/wp-content/themes/`

## Примітки

- Основні кастомізації знаходяться в `rook-child/`
- Не редагуйте файли в `rook/` напряму - використовуйте дочірню тему

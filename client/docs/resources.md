# Полезные ресурсы и справочная информация

Здесь собрана общая информация по проекту SkillDrill.  
⚠️ ВНИМАНИЕ: никаких паролей, ключей и токенов сюда не кладём. Только общая справка.

---

## 1. Серверы

### Production (боевой сервер)

- **Адрес:** http://49.12.110.251/
- **Роль:** используется пользователями
- **Где развернут:** Hetzner
- **Доступ:** SSH только через ключи (подробности у админа)

### Staging (тестовый сервер)

- **Адрес:** <укажи IP или домен>
- **Роль:** тестирование новых функций перед релизом
- **База данных:** копия или отдельная БД для тестов

# OPS: сервер, Docker, Mongo, Compass

## 1.1 Перезапуск / деплой

## для локального запуска сервер+БД

docker compose down -v
docker compose up -d --build

# server

ssh -i ~/.ssh/id_rsa_hetzner deployer@49.12.110.251

# server from main

cd /opt/skilldrill
git pull origin main

```bash
ssh -i ~/.ssh/id_rsa_hetzner -N -L 27019:127.0.0.1:27017 deployer@49.12.110.251
# на сервере
cd /opt/skilldrill/server

# подтянуть код (если деплой из Git)
git fetch && git reset --hard origin/main

# поднять/обновить контейнеры
docker compose up -d

# пересобрать API после изменений Dockerfile/зависимостей
docker compose up -d --build api

# принудительно пересоздать контейнер (без сборки)
docker compose up -d --force-recreate api

docker ps                              # список контейнеров
docker compose ps                      # то же по compose-проекту
docker logs -f skilldrill-api          # «хвост» логов API
docker logs -f skilldrill-mongo        # логи Mongo
docker logs -n 200 skilldrill-api      # последние 200 строк
docker compose logs -f api
docker compose logs -f mongo


# здоровье Mongo (healthcheck)
docker ps | grep skilldrill-mongo      # статус: (healthy/starting)

docker exec -it skilldrill-api printenv | grep -E 'NODE_ENV|PORT|MONGO_URI'
docker exec -it skilldrill-mongo printenv | grep MONGO_INITDB



---

## 2. Базы данных

- **Тип:** MongoDB
- **Где расположена:** в контейнере на сервере
- **Использование:** хранение пользователей, задач и т. д.

## Remote MongoDB через Compass (Hetzner)

mongodb://127.0.0.1:27019/skilldrill

**SSH-туннель (на Mac):** когда смотрим сервер
ssh -i ~/.ssh/id_rsa_hetzner -L 27019:127.0.0.1:27018 deployer@49.12.110.251



## in compas
mongodb://root:<root_pass>@localhost:27019/skilldrill?authSource=admin



---

## 3. Почта

- Lazarev Slava 549132w@gmail.com
- Lazarev Vladlen slepikSlimasWorkSpace@gmail.com
- Nepomniashchii Mikhail michey85@gmail.com
- **Провайдер:** Gmail
- **Доступ:** у кого есть логин/пароль — см. в менеджере паролей

---

## 4. CI/CD (Continuous Integration / Continuous Deployment)

**Что это:**
CI/CD — это автоматизация сборки, тестов и деплоя.

- **CI (Continuous Integration)** → проверка кода при каждом коммите (линтеры, тесты).
- **CD (Continuous Deployment)** → автоматический деплой после пуша в `main` или другой ветки.

### GitHub Actions

- **Workflow-файл:** `.github/workflows/deploy.yml`
- **Что делает:**
  - собирает проект (npm install + build)
  - прогоняет тесты
  - деплоит на сервер
- **Полезные ссылки:**
  - Документация: https://docs.github.com/en/actions

---

## 5. Мониторинг

**Что это:**
Мониторинг — это системы, которые показывают, как живёт сервер и приложение: работает ли оно, сколько памяти/CPU ест, какие ошибки возникают.

- **Инструмент:** (например, UptimeRobot / Grafana / Prometheus / Sentry)
- **Что отслеживаем:**
  - аптайм (сервер доступен или нет)
  - ошибки на фронте или бэке
  - производительность (время отклика, нагрузка)
- **Ссылка на дашборд:** <URL>

---

## 6. Сервисы и интеграции

- **GitHub Projects:** задачи команды → https://github.com/users/LazarevSlava/projects/8
- **Telegram:** LWB → https://t.me/+kTOP5J5AqtozNjBi

---

## 7.Ключи

- **Bitwarden** https://vault.bitwarden.eu/#/organizations/ae63a29c-cdd5-4277-88ae-b35300711e81/vault?collectionId=d416a4f8-00a7-4d54-8879-b35300730fd6

## 7. Документация проекта

- **Onboarding.md:** как быстро развернуть проект локально
- **API.md:** описание доступных API
- **resources.md:** текущий файл, справка

---

## 8. FAQ (часто задаваемые вопросы)

- **Где взять ключи и пароли?**
  → В менеджере паролей (Bitwarden/1Password)

- **Как обновить проект локально?**
  → `git pull origin main`

- **Как запустить фронт локально?**
  → `cd client && npm install && npm start`

- **Как запустить бэк локально?**
  → `cd server && npm install && npm run dev`

---
```

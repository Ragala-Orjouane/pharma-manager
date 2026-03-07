# PharmaManager
Application de gestion de pharmacie — Développé dans le cadre de test technique SMARTHOLOL

---

## Stack Technique

- **Backend** : Django 6.x + Django REST Framework + PostgreSQL + drf-spectacular (Swagger)
- **Frontend** : React.js (Vite) + React Router + @tanstack/react-query + Axios
- **Documentation API** : Swagger UI

---

## Installation Backend

1. Se placer dans le dossier backend :

```bash
cd pharma_backend

# Linux / macOS
python -m venv venv
source venv/bin/activate

# Windows PowerShell
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt   #Installer les dépendances
cp .env.example .env   #Configurer les variables d'environnement
python manage.py migrate
python manage.py runserver

``` 
## Variables d'Environnement (.env) 

``` 
DEBUG=True
SECRET_KEY=SECRET_KEY
DB_NAME=pharma_db
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
DB_HOST=localhost
DB_PORT=5432

```

 
## Installation Frontend 
```bash 
cd frontend 
npm install 
npm install react-router-dom @tanstack/react-query axios
cp .env.example .env 
npm run dev 
```

 
## Documentation API 
Swagger UI disponible sur : http://localhost:8000/api/schema/swagger-ui/ 


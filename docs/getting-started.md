# Getting started

## Setup

Clone the repository

```bash
git clone git@github.com:abteilung6/edurika.git
```

Create a virtual environment and activate it

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
uvicorn edurika.main:app --reload
```

## Linting

To run Ruff as a linter
```
ruff check                          # Lint all files in the current directory (and any subdirectories).
ruff check path/to/code/            # Lint all files in `/path/to/code` (and any subdirectories).
ruff check path/to/code/*.py        # Lint all `.py` files in `/path/to/code`.
ruff check path/to/code/to/file.py  # Lint `file.py`
```

Run Ruff as a formatter
```
ruff format                          # Format all files in the current directory (and any subdirectories).
ruff format path/to/code/            # Format all files in `/path/to/code` (and any subdirectories).
ruff format path/to/code/*.py        # Format all `.py` files in `/path/to/code`.
ruff format path/to/code/to/file.py  # Format `file.py`.
ruff format @arguments.txt           # Format using an input file, treating its contents as newline-delimited command-line arguments
```

To lint and check types with mypy

```bash
mypy .
```

Run tests

```bash
pytest
pytest tests/local
pytest tests/local/test_main.py
```

## Database

Create new migration
```
alembic revision --autogenerate -m "Initial migration"
```

Apply latest migrations
```
alembic upgrade head
```

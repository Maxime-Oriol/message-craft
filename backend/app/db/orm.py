import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

class Table:
    CONTACT = "contact_messages"
    USERS = "users"

class ORM:
    _select:str = "*"
    _from:str
    _name:str
    _where:str|None = None
    _order_by:str|None = None
    _limit:int|None = None

    def __init__(self, **kwargs):
        self.conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD")
        )
        self.cursor = self.conn.cursor()
        self._reset_query()

        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def __del__(self):
        self.close()

    def close(self):
        self.cursor.close()
        self.conn.close()

    def _reset_query(self):
        self._select = "*"
        self._from = self._name
        self._where = None
        self._order_by = None
        self._limit = None

    def select(self, fields:str|dict="*"):
        self._select = ", ".join(fields) if isinstance(fields, dict) else fields
        return self

    def from_(self, table):
        self._from = table
        return self
    
    def where(self, condition:str):
        self._where = condition
        return self

    def order_by(self, field):
        self._order_by = field
        return self

    def limit(self, number:int):
        self._limit = number
        return self

    def query(self, raw_sql=None):
        if raw_sql:
            with self.conn.cursor() as cur:
                cur.execute(raw_sql)
                return cur.fetchall()

        if not self._from:
            raise ValueError("FROM clause is missing")

        query = f"SELECT {self._select} FROM {self._from}"
        
        if self._where:
            query += f" WHERE {self._where}"
        if self._order_by:
            query += f" ORDER BY {self._order_by}"
        if self._limit:
            query += f" LIMIT {self._limit}"

        self.cursor.execute(query)
        result = self.cursor.fetchall()
        self._reset_query()
        return result
    
    def insert(self, data:dict):
        data.pop("id", None)
        keys = list(data.keys())
        values = list(data.values())
        columns = [f"\"{key}\"" for key in keys]
        columns = ", ".join(columns)
        placeholders = ", ".join(["%s"] * len(values))

        query = f"INSERT INTO \"{self._from}\" ({columns}) VALUES ({placeholders}) RETURNING *"
        self.cursor.execute(query, values)
        self.conn.commit()
        row = self.cursor.fetchone()
        if row:
            columns = [desc[0] for desc in self.cursor.description]
            return dict(zip(columns, row))
        return None

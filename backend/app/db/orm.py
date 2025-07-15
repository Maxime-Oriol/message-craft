import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

class Table:
    CONTACT = "contact_message"
    MESSAGE = "craft_message"
    LLM_DATASET = "llm_dataset"
    LLM_MODEL = "llm_model_version"

class ORM:
    id:str
    _select:str = "*"
    _from:str
    _name:str
    _where:str|None = None
    _where_params:tuple = ()
    _order_by:str|None = None
    _limit:int|None = 100

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
    
    def where(self, condition:str, params: tuple = ()):
        self._where = condition
        self._where_params = params
        return self

    def order_by(self, field):
        self._order_by = field
        return self

    def limit(self, number:int):
        self._limit = number
        return self

    def query_row(self, raw_sql=None):
        result = self.query(raw_sql)
        return self.__class__(**result[0]) if result else None
    
    def query(self, raw_sql=None):
        def row_to_dict(columns, row):
            return dict(zip(columns, row))

        if raw_sql:
            self.cursor.execute(raw_sql)
            rows = self.cursor.fetchall()
            columns = [desc[0] for desc in self.cursor.description]
            return [row_to_dict(columns, row) for row in rows]

        if not self._from:
            raise ValueError("FROM clause is missing")

        query = f"SELECT {self._select} FROM {self._from}"
        if self._where:
            query += f" WHERE {self._where}"
        if self._order_by:
            query += f" ORDER BY {self._order_by}"
        if self._limit:
            query += f" LIMIT {self._limit}"

        self.cursor.execute(query, self._where_params)
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]

        self._reset_query()

        return [row_to_dict(columns, row) for row in rows]
    
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

    def update_all(self):
        keys = [key for key in self.__annotations__ if not key.startswith("_") and key != "id"]
        values = [getattr(self, key) for key in keys]
        update_text = [f'"{key}" = %s' for key in keys]

        query = f"""
            UPDATE "{self._from}" 
            SET {", ".join(update_text)}
            WHERE id = %s
            RETURNING *
        """

        self.cursor.execute(query, values + [self.id])
        self.conn.commit()
        row = self.cursor.fetchone()
        if row:
            columns = [desc[0] for desc in self.cursor.description]
            for col, val in zip(columns, row):
                setattr(self, col, val)
            return self
        return None

    def update(self, field: str|None = None, value = None):
        if not field:
            return self.update_all()
        
        query = f'UPDATE "{self._from}" SET "{field}" = %s WHERE id = %s RETURNING *'
        self.cursor.execute(query, (value, self.id))
        self.conn.commit()
        row = self.cursor.fetchone()
        if row:
            columns = [desc[0] for desc in self.cursor.description]
            for col, val in zip(columns, row):
                setattr(self, col, val)
        return self
    
    def delete(self, where: str|None = None) -> bool:
        if not self.id:
            return False
        if not where:
            query = f'DELETE FROM {self._from} WHERE id = %s'
            self.cursor.execute(query, (self.id,))
        else:
            query = f'DELETE FROM {self._from} WHERE %s'
            self.cursor.execute(query, (where,))
        self.conn.commit()
        return True
    
    @classmethod
    def from_dict(cls, data: dict):
        return cls(**data)
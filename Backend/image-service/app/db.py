import psycopg2
from psycopg2.extras import RealDictCursor
from flask import current_app

def query(sql, params=None):
    """
    Execute a query and return the result.
    
    Args:
        sql (str): The SQL query string.
        params (tuple or dict, optional): The parameters to pass into the query.
    
    Returns:
        list: A list of dictionary results for SELECT queries.
        None: For non-SELECT queries (e.g., INSERT, UPDATE, DELETE).
    """
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(current_app.config['DATABASE_URI'], cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute(sql, params)
        
        if sql.strip().upper().startswith("SELECT"):
            result = cursor.fetchall()
        else:
            conn.commit()
            result = None
        
        cursor.close()
        return result
    except Exception as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

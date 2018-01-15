from sqlalchemy.engine.reflection import Inspector
from db import Category, DBSession, engine, Base

"""
This script will add the appropriate tables to the catalog database, 
it is a critical step in setting up the application
"""
categories = [
    "Alternative",
    "Blues",
    "Acoustic Blues",
    "Children's Music",
    "Christian Gospel",
    "Classical",
    "Country",
    "Dance",
    "Easy Listening",
    "Electronic",
    "Hip Hop/Rap",
    "Holiday",
    "Industrial",
    "Jazz",
    "New Age",
    "Opera",
    "Pop",
    "R&B/Soul",
    "Reggae",
    "Rock",
    "Soundtrack",
    "World",
]

inspector = Inspector.from_engine(engine)

# Create all tables if they don't exist
if not "categories" in inspector.get_table_names():
    Base.metadata.create_all(engine)
    session = DBSession()

    # add all the categories to the newly created categories table
    for category in categories:
        new_category = Category(name=category)
        session.add(new_category)

    session.commit()
    session.close()

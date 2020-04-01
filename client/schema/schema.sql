CREATE TABLE users
(
  id SERIAL,
  screenname VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  friends VARCHAR(50)
  [],
	UNIQUE
  (screenname)
)
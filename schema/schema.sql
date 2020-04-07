CREATE TABLE users
(
  id SERIAL,
  screenname VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  friends VARCHAR(50)
  [],
	UNIQUE
  (screenname)
)

  UPDATE users 
SET friends = 
CASE
	WHEN array_length(friends, 1) IS NULL THEN array_append(friends, 'dasd2')
	WHEN NOT friends @> ARRAY['dasd2']::varchar[] THEN array_append(friends, 'dasd2') 
	ELSE friends
END
WHERE screenname = 'dasd'

  UPDATE users
SET friends = array_remove(friends, '9;test')
WHERE screenname = 'blank'
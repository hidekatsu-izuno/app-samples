CREATE TABLE mt_user (
  user_id VARCHAR(36) NOT NULL,
  user_email VARCHAR(256),
  user_name VARCHAR(64) NOT NULL,
  comment VARCHAR(1000),
  update_time TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT pk_mt_user PRIMARY KEY (user_id),
  CONSTRAINT ux_mt_user_01 UNIQUE (user_email)
);

INSERT INTO mt_user (
  user_id,
  user_email,
  user_name,
  comment,
  update_time
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  'admin@example.com',
  'Administrator',
  NULL,
  CURRENT_TIMESTAMP
);

CREATE TABLE mt_user_password (
  user_id VARCHAR(36) NOT NULL,
  user_password BYTEA NOT NULL,
  user_password_salt BYTEA NOT NULL,
  CONSTRAINT pk_mt_user_password PRIMARY KEY (user_id)
);

INSERT INTO mt_user_password (
  user_id,
  user_password,
  user_password_salt,
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  '\x00',
  '\x00'
);

CREATE TABLE mt_user_role (
  user_id VARCHAR(36) NOT NULL,
  role_cd VARCHAR(10) NOT NULL,
  CONSTRAINT pk_mt_user_role PRIMARY KEY (user_id, role_cd)
);

INSERT INTO mt_user_role (
  user_id,
  role_cd
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  'admin'
);

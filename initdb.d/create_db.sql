CREATE TABLE mt_user (
  user_id VARCHAR(36) NOT NULL,
  user_email VARCHAR(256),
  user_name VARCHAR(64) NOT NULL,
  birth_date DATE,
  is_deleted BOOLEAN NOT NULL,
  comment VARCHAR(1000),
  update_time TIMESTAMP WITH TIME ZONE NOT NULL,
  revision_no INTEGER NOT NULL,
  CONSTRAINT pk_mt_user PRIMARY KEY (user_id),
  CONSTRAINT ux_mt_user_01 UNIQUE (user_email)
);

INSERT INTO mt_user (
  user_id,
  user_email,
  user_name,
  birth_date,
  is_deleted,
  comment,
  update_time,
  revision_no
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  'admin@example.com',
  'Administrator',
  NULL,
  FALSE,
  NULL,
  CURRENT_TIMESTAMP,
  0
);

CREATE TABLE mt_user_password (
  user_id VARCHAR(36) NOT NULL,
  user_password BYTEA NOT NULL,
  revision_no INTEGER NOT NULL,
  CONSTRAINT pk_mt_user_password PRIMARY KEY (user_id)
);

INSERT INTO mt_user_password (
  user_id,
  user_password,
  revision_no
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  '\xcd1ffe065a5f00de8c6fc6b325402246',
  0
);

CREATE TABLE mt_role (
  role_cd VARCHAR(10) NOT NULL,
  role_name VARCHAR(64) NOT NULL,
  revision_no INTEGER NOT NULL,
  CONSTRAINT pk_mt_role PRIMARY KEY (role_cd)
);

INSERT INTO mt_role (
  role_cd,
  role_name,
  revision_no
) VALUES (
  'admin',
  '管理者',
  0
), (
  'user',
  '利用者',
  0
);

CREATE TABLE mt_user_role (
  user_id VARCHAR(36) NOT NULL,
  role_cd VARCHAR(10) NOT NULL,
  revision_no INTEGER NOT NULL,
  CONSTRAINT pk_mt_user_role PRIMARY KEY (user_id, role_cd)
);

INSERT INTO mt_user_role (
  user_id,
  role_cd,
  revision_no
) VALUES (
  '9a192654-08fc-11ee-9cff-00155d80ceb2',
  'admin',
  0
);
